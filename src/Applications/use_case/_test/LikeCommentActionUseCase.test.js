const LikeCommentActionUseCase = require('../LikeCommentActionUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('LikeCommentActionUseCase', () => {
  it('should throw error if use case payload not contain required id\'s token', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      commentId: 'comment-123',
    };
    const likeCommentActionUseCase = new LikeCommentActionUseCase({});

    // Action & Assert
    await expect(likeCommentActionUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('LIKE_COMMENT_ACTION_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if provided payload are not in string datatypes', async () => {
    // Arrange
    const useCasePayload = {
      userId: 123,
      commentId: [],
      threadId: {},
    };
    const likeCommentActionUseCase = new LikeCommentActionUseCase({});

    // Action & Assert
    await expect(likeCommentActionUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('LIKE_COMMENT_ACTION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating add new like in database if comment is not yet liked by the user', async () => {
    const useCasePayload = {
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const mockCommentRepo = new CommentRepository();
    const mockLikeRepo = new LikeRepository();

    mockCommentRepo.verifyCommentOnThreadById = jest.fn(() => Promise.resolve());
    mockLikeRepo.checkIfCommentAlreadyLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepo.addLikeToComment = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          comment_id: 'comment-123',
          owner: 'user-123',
        },
      ]));
    mockLikeRepo.deleteLikeFromComment = jest.fn();

    const likeCommentActionUseCase = new LikeCommentActionUseCase({
      commentRepository: mockCommentRepo,
      likeRepository: mockLikeRepo,
    });

    await likeCommentActionUseCase.execute(useCasePayload);

    expect(mockCommentRepo.verifyCommentOnThreadById)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
    expect(mockLikeRepo.checkIfCommentAlreadyLiked)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockLikeRepo.addLikeToComment)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockLikeRepo.deleteLikeFromComment)
      .not.toHaveBeenCalled();
  });
  it('should orchestrating delete a like from database if comment is already liked by the user', async () => {
    const useCasePayload = {
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const mockCommentRepo = new CommentRepository();
    const mockLikeRepo = new LikeRepository();

    mockCommentRepo.verifyCommentOnThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepo.checkIfCommentAlreadyLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepo.deleteLikeFromComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepo.addLikeToComment = jest.fn();

    const likeCommentActionUseCase = new LikeCommentActionUseCase({
      commentRepository: mockCommentRepo,
      likeRepository: mockLikeRepo,
    });

    await likeCommentActionUseCase.execute(useCasePayload);

    expect(mockCommentRepo.verifyCommentOnThreadById)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
    expect(mockLikeRepo.checkIfCommentAlreadyLiked)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockLikeRepo.deleteLikeFromComment)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockLikeRepo.addLikeToComment)
      .not.toHaveBeenCalled();
  });
});
