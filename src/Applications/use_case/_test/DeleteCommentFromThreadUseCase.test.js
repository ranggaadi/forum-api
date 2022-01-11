const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentFromThreadUseCase = require('../DeleteCommentFromThreadUseCase');

describe('DeleteCommentFromThread use case', () => {
  it('should throw error if use case payload not contain required id\'s', async () => {
    // Arrange
    const useCasePayload = {
      author: 'user-123',
      threadId: 'thread-123',
    };
    const deleteCommentFromThreadUseCase = new DeleteCommentFromThreadUseCase({});

    // Action & Assert
    await expect(deleteCommentFromThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_FROM_THREAD_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if provided id\'s is not string', async () => {
    // Arrange
    const useCasePayload = {
      author: 1,
      threadId: [],
      commentId: {},
    };
    const deleteCommentFromThreadUseCase = new DeleteCommentFromThreadUseCase({});

    // Action & Assert
    await expect(deleteCommentFromThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_FROM_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_SPECIFICATION');
  });
  it('should orchestrating the delete comment action properly', async () => {
    const useCasePayload = {
      author: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockCommentRepo = new CommentRepository();

    // mock repo
    mockCommentRepo.verifyCommentOnThreadById = jest.fn(() => Promise.resolve());
    mockCommentRepo.verifyCommentAuthor = jest.fn(() => Promise.resolve());
    mockCommentRepo.deleteCommentFromThread = jest.fn(() => Promise.resolve());

    const deleteCommentFromThreadUseCase = new DeleteCommentFromThreadUseCase(
      { commentRepository: mockCommentRepo },
    );

    await deleteCommentFromThreadUseCase.execute(useCasePayload);

    expect(mockCommentRepo.verifyCommentOnThreadById)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
    expect(mockCommentRepo.verifyCommentAuthor)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.author);
    expect(mockCommentRepo.deleteCommentFromThread).toBeCalledWith(useCasePayload.commentId);
  });
});
