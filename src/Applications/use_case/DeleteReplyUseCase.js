class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    await this._replyRepository
      .verifyReplyOnCommentOnThreadById(
        useCasePayload.replyId, useCasePayload.commentId, useCasePayload.threadId,
      );
    await this._replyRepository
      .verifyReplyAuthor(useCasePayload.replyId, useCasePayload.author);
    await this._replyRepository.deleteReply(useCasePayload.replyId);
  }

  _verifyPayload(payload) {
    const {
      author, threadId, commentId, replyId,
    } = payload;

    if (!author || !threadId || !commentId || !replyId) {
      throw new Error('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof author !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string' || typeof replyId !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyUseCase;
