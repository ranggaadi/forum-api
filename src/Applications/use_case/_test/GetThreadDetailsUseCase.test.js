const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadDetails = require('../../../Domains/threads/entities/ThreadDetails');
const CommentDetails = require('../../../Domains/comments/entities/CommentDetails');
const ReplyDetails = require('../../../Domains/replies/entities/ReplyDetails');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

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
  it('should returning thread details correctly', async () => {
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
        id: 'comment-123',
        username: 'userpertama',
        date: now.toISOString(),
        content: 'bebas 123',
        likeCount: 2,
        isDeleted: false,
        replies: [],
      }),
      new CommentDetails({
        id: 'comment-456',
        username: 'userkedua',
        date: now.toISOString(),
        content: 'bebas',
        likeCount: 5,
        isDeleted: true,
        replies: [],
      }),
    ];

    const expectedReplyDetails = [
      {
        id: 'reply-123',
        content: 'ini balasan komentar pertama',
        owner: 'user-123',
        thread_id: 'thread-123',
        comment_id: 'comment-123',
        is_delete: false,
        created_at: now,
        username: 'userpertama',
      },
      {
        id: 'reply-456',
        content: 'bebas',
        owner: 'user-456',
        thread_id: 'thread-123',
        comment_id: 'comment-123',
        is_delete: true,
        created_at: now,
        username: 'userkedua',
      },
      {
        id: 'reply-000',
        content: 'ini balasan komentar ketiga',
        owner: 'user-123',
        thread_id: 'thread-123',
        comment_id: 'comment-456',
        is_delete: false,
        created_at: now,
        username: 'userpertama',
      },
      {
        id: 'reply-666',
        content: 'bebas keempat',
        owner: 'user-123',
        thread_id: 'thread-123',
        comment_id: 'comment-456',
        is_delete: false,
        created_at: now,
        username: 'userkedua',
      },
    ];

    // const expectedReplyDetails1 = [
    //   new ReplyDetails({
    //     id: 'reply-123',
    //     username: 'userpertama',
    //     date: now.toISOString(),
    //     content: 'ini balasan komentar pertama',
    //     isDeleted: false,
    //   }),
    //   new ReplyDetails({
    //     id: 'reply-456',
    //     username: 'userkedua',
    //     date: now.toISOString(),
    //     content: 'bebas',
    //     isDeleted: true,
    //   }),
    // ];

    // const expectedReplyDetails2 = [
    //   new ReplyDetails({
    //     id: 'reply-000',
    //     username: 'userpertama',
    //     date: now.toISOString(),
    //     content: 'ini balasan komentar ketiga',
    //     isDeleted: false,
    //   }),
    //   new ReplyDetails({
    //     id: 'reply-666',
    //     username: 'userkedua',
    //     date: now.toISOString(),
    //     content: 'bebas keempat',
    //     isDeleted: false,
    //   }),
    // ];

    const expectedOutput = new ThreadDetails({
      id: 'thread-123',
      title: 'title thread',
      body: 'body thread',
      date: now.toISOString(),
      username: 'userpertama',
      comments: [
        new CommentDetails({
          id: 'comment-123',
          username: 'userpertama',
          date: now.toISOString(),
          content: 'bebas 123',
          likeCount: 2,
          isDeleted: false,
          replies: [
            new ReplyDetails({
              id: 'reply-123',
              username: 'userpertama',
              date: now.toISOString(),
              content: 'ini balasan komentar pertama',
              isDeleted: false,
            }),
            new ReplyDetails({
              id: 'reply-456',
              username: 'userkedua',
              date: now.toISOString(),
              content: 'bebas',
              isDeleted: true,
            }),
          ],
        }),
        new CommentDetails({
          id: 'comment-456',
          username: 'userkedua',
          date: now.toISOString(),
          content: 'bebas',
          isDeleted: true,
          likeCount: 5,
          replies: [
            new ReplyDetails({
              id: 'reply-000',
              username: 'userpertama',
              date: now.toISOString(),
              content: 'ini balasan komentar ketiga',
              isDeleted: false,
            }),
            new ReplyDetails({
              id: 'reply-666',
              username: 'userkedua',
              date: now.toISOString(),
              content: 'bebas keempat',
              isDeleted: false,
            }),
          ],
        }),
      ],
    });

    const mockThreadRepo = new ThreadRepository();
    const mockCommentRepo = new CommentRepository();
    const mockReplyRepo = new ReplyRepository();
    const mockLikeRepo = new LikeRepository();

    // mock repo
    mockThreadRepo.verifyThreadById = jest.fn(() => Promise.resolve());
    mockThreadRepo.getThreadDetails = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThreadDetails));
    mockLikeRepo.countCommentLikes = jest.fn()
      .mockImplementation(() => Promise.resolve(
        [
          { comment_id: 'comment-123', count: '2' },
          { comment_id: 'comment-456', count: '5' },
        ],
      ));
    mockCommentRepo.getCommentDetailsOnThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedCommentDetails));
    mockReplyRepo.getReplyDetailsOnThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReplyDetails));

    const getThreadDetailsUseCase = new GetThreadDetailsUseCase(
      {
        threadRepository: mockThreadRepo,
        commentRepository: mockCommentRepo,
        replyRepository: mockReplyRepo,
        likeRepository: mockLikeRepo,
      },
    );

    const threadDetails = await getThreadDetailsUseCase.execute(useCasePayload);

    expect(mockThreadRepo.verifyThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepo.getThreadDetails).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepo.getCommentDetailsOnThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockLikeRepo.countCommentLikes)
      .toBeCalledWith(expectedCommentDetails.map((comment) => comment.id));
    expect(mockReplyRepo.getReplyDetailsOnThread)
      .toBeCalledWith(useCasePayload.threadId, expectedCommentDetails.map((comment) => comment.id));
    expect(mockReplyRepo.getReplyDetailsOnThread).toHaveBeenCalledTimes(1);
    expect(threadDetails).toStrictEqual(expectedOutput);
  });
});
