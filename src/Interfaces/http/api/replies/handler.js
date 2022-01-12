const AddReplyToCommentUseCase = require('../../../../Applications/use_case/AddReplyToCommentUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler({ payload, auth, params }, h) {
    const addReplyToCommentUseCase = this._container.getInstance(AddReplyToCommentUseCase.name);
    const useCasePayload = {
      content: payload.content,
      threadId: params.threadId,
      commentId: params.commentId,
      owner: auth.credentials.id,
    };

    const addedReply = await addReplyToCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler({ auth, params }) {
    const deleteReplyUseCase = this._container
      .getInstance(DeleteReplyUseCase.name);

    const useCasePayload = {
      author: auth.credentials.id,
      threadId: params.threadId,
      commentId: params.commentId,
      replyId: params.replyId,
    };

    await deleteReplyUseCase.execute(useCasePayload);

    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
