const AddReplyToCommentUseCase = require('../AddReplyToCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');

describe('Add reply to comment use case', () => {
  it('should orchestrating add comment to a thread correctly', async () => {
    const useCasePayload = {
      content: 'ini adalah sebuah balasan komentar',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const expectedOutput = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    // depedency use case
    const mockCommentRepo = new CommentRepository();
    const mockReplyRepo = new ReplyRepository();

    mockCommentRepo.verifyCommentOnThreadById = jest.fn(() => Promise.resolve());
    mockReplyRepo.addReplyToCommentOnThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedOutput));

    const addReplyToCommentUseCase = new AddReplyToCommentUseCase({
      commentRepository: mockCommentRepo,
      replyRepository: mockReplyRepo,
    });

    const addedReply = await addReplyToCommentUseCase.execute(useCasePayload);

    expect(addedReply).toStrictEqual(expectedOutput);
    expect(mockCommentRepo.verifyCommentOnThreadById)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
    expect(mockReplyRepo.addReplyToCommentOnThread).toBeCalledWith(new NewReply({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
    }));
  });
});
