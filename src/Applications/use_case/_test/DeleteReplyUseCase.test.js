const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReply use case', () => {
  it('should throw error if use case payload not contain required id\'s', async () => {
    // Arrange
    const useCasePayload = {
      author: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if provided id\'s is not string', async () => {
    // Arrange
    const useCasePayload = {
      author: 1,
      threadId: [],
      commentId: {},
      replyId: 123,
    };
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_SPECIFICATION');
  });
  it('should orchestrating the delete reply action properly', async () => {
    const useCasePayload = {
      author: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };

    const mockReplyRepo = new ReplyRepository();

    // mock repo
    mockReplyRepo.verifyReplyOnCommentOnThreadById = jest.fn(() => Promise.resolve());
    mockReplyRepo.verifyReplyAuthor = jest.fn(() => Promise.resolve());
    mockReplyRepo.deleteReply = jest.fn(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase(
      { replyRepository: mockReplyRepo },
    );

    await deleteReplyUseCase.execute(useCasePayload);

    expect(mockReplyRepo.verifyReplyOnCommentOnThreadById)
      .toBeCalledWith(useCasePayload.replyId, useCasePayload.commentId, useCasePayload.threadId);
    expect(mockReplyRepo.verifyReplyAuthor)
      .toBeCalledWith(useCasePayload.replyId, useCasePayload.author);
    expect(mockReplyRepo.deleteReply).toBeCalledWith(useCasePayload.replyId);
  });
});
