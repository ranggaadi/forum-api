const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadDetails = require('../../../Domains/threads/entities/ThreadDetails');
const CommentDetails = require('../../../Domains/comments/entities/CommentDetails');
const ReplyDetails = require('../../../Domains/replies/entities/ReplyDetails');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('GetThreadDetails use case', () => {
  it('should throw error if use case payload not contain required thread id', async () => {
    // Arrange
    const useCasePayload = {
    };
    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({});

    // Action & Assert
    await expect(getThreadDetailsUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_THREAD_DETAILS_USE_CASE.PAYLOAD_NOT_CONTAIN_THREAD_ID');
  });

  it('should throw error if provided id\'s is not string', async () => {
    // Arrange
    const useCasePayload = {
      threadId: [],
    };
    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({});

    // Action & Assert
    await expect(getThreadDetailsUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_THREAD_DETAILS_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should orchestrating the delete comment action properly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const now = new Date();

    const expectedThreadDetails = new ThreadDetails({
      id: 'thread-123',
      title: 'title thread',
      body: 'body thread',
      date: now.toISOString(),
      username: 'userpertama',
      comments: [],
    });

    const expectedCommentDetails = [
      new CommentDetails({
        id: 'comment-456',
        username: 'userkedua',
        date: now.toISOString(),
        content: 'bebas',
        isDeleted: true,
        replies: [],
      }),
    ];

    const expectedReplyDetails = [
      new ReplyDetails({
        id: 'reply-123',
        username: 'userpertama',
        date: now.toISOString(),
        content: 'ini balasan komentar pertama',
        isDeleted: false,
      }),
      new ReplyDetails({
        id: 'reply-455',
        username: 'userkedua',
        date: now.toISOString(),
        content: 'bebas',
        isDeleted: true,
      }),
    ];

    const expectedOutput = new ThreadDetails({
      id: 'thread-123',
      title: 'title thread',
      body: 'body thread',
      date: now.toISOString(),
      username: 'userpertama',
      comments: [
        new CommentDetails({
          id: 'comment-456',
          username: 'userkedua',
          date: now.toISOString(),
          content: 'bebas',
          isDeleted: true,
          replies: [
            new ReplyDetails({
              id: 'reply-123',
              username: 'userpertama',
              date: now.toISOString(),
              content: 'ini balasan komentar pertama',
              isDeleted: false,
            }),
            new ReplyDetails({
              id: 'reply-455',
              username: 'userkedua',
              date: now.toISOString(),
              content: 'bebas',
              isDeleted: true,
            }),
          ],
        }),
      ],
    });

    const mockThreadRepo = new ThreadRepository();
    const mockCommentRepo = new CommentRepository();
    const mockReplyRepo = new ReplyRepository();

    // mock repo
    mockThreadRepo.verifyThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepo.getThreadDetails = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThreadDetails));
    mockCommentRepo.getCommentDetailsOnThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedCommentDetails));
    mockReplyRepo.getReplyDetailsOnThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReplyDetails));

    const getThreadDetailsUseCase = new GetThreadDetailsUseCase(
      {
        threadRepository: mockThreadRepo,
        commentRepository: mockCommentRepo,
        replyRepository: mockReplyRepo,
      },
    );

    const threadDetails = await getThreadDetailsUseCase.execute(useCasePayload);

    expect(mockThreadRepo.verifyThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepo.getThreadDetails).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepo.getCommentDetailsOnThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepo.getReplyDetailsOnThread).toHaveBeenCalledTimes(1);
    expect(threadDetails).toStrictEqual(expectedOutput);
  });
});
