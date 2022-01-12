const AddCommentToThreadUseCase = require('../../../../Applications/use_case/AddCommentToThreadUseCase');
const DeleteCommentFromThreadUseCase = require('../../../../Applications/use_case/DeleteCommentFromThreadUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;
    this.addCommentHandler = this.addCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async addCommentHandler({ payload, auth, params }, h) {
    const addCommentToThreadUseCase = this._container.getInstance(AddCommentToThreadUseCase.name);
    const useCasePayload = {
      content: payload.content,
      threadId: params.threadId,
      owner: auth.credentials.id,
    };

    const addedComment = await addCommentToThreadUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler({ auth, params }) {
    const deleteCommentFromThreadUseCase = this._container
      .getInstance(DeleteCommentFromThreadUseCase.name);

    const useCasePayload = {
      author: auth.credentials.id,
      threadId: params.threadId,
      commentId: params.commentId,
    };

    await deleteCommentFromThreadUseCase.execute(useCasePayload);

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
