class LikeCommentActionUseCase {
  constructor({ commentRepository, likeRepository }) {
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    await this._commentRepository
      .verifyCommentOnThreadById(useCasePayload.commentId, useCasePayload.threadId);
    const commentStatus = await this._likeRepository
      .checkIfCommentAlreadyLiked(useCasePayload.commentId, useCasePayload.userId);
    if (commentStatus) {
      await this._likeRepository
        .deleteLikeFromComment(useCasePayload.commentId, useCasePayload.userId);
    } else {
      await this._likeRepository
        .addLikeToComment(useCasePayload.commentId, useCasePayload.userId);
    }
  }

  _validatePayload(useCasePayload) {
    const { userId, threadId, commentId } = useCasePayload;
    if (!userId || !threadId || !commentId) {
      throw new Error('LIKE_COMMENT_ACTION_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('LIKE_COMMENT_ACTION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeCommentActionUseCase;
