const LikeCommentActionUseCase = require('../../../../Applications/use_case/LikeCommentActionUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
    this.likeActionHandler = this.likeActionHandler.bind(this);
  }

  async likeActionHandler({ params, auth }) {
    const likeCommentActionUseCase = this._container.getInstance(LikeCommentActionUseCase.name);
    const useCasePayload = {
      userId: auth.credentials.id,
      threadId: params.threadId,
      commentId: params.commentId,
    };
    await likeCommentActionUseCase.execute(useCasePayload);
    return {
      status: 'success',
    };
  }
}

module.exports = LikesHandler;
