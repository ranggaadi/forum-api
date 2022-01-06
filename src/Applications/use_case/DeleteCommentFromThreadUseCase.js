class DeleteCommentFromThreadUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    await this._commentRepository
      .verifyCommentOnThreadById(useCasePayload.commentId, useCasePayload.threadId);
    await this._commentRepository
      .verifyCommentAuthor(useCasePayload.commentId, useCasePayload.author);
    await this._commentRepository.deleteCommentFromThread(useCasePayload.commentId);
  }

  _verifyPayload(payload) {
    const { author, threadId, commentId } = payload;

    if (!author || !threadId || !commentId) {
      throw new Error('DELETE_COMMENT_FROM_THREAD_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof author !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('DELETE_COMMENT_FROM_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentFromThreadUseCase;
