class GetThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    await this._threadRepository.verifyThreadById(useCasePayload.threadId);
    const threadDetails = await this._threadRepository.getThreadDetails(useCasePayload.threadId);
    const threadComments = await this._commentRepository
      .getCommentDetailsOnThread(useCasePayload.threadId);

    // eslint-disable-next-line no-restricted-syntax
    for (const comment of threadComments) {
      // eslint-disable-next-line no-await-in-loop
      const replies = await this._replyRepository
        .getReplyDetailsOnThread(useCasePayload.threadId, comment.id);
      comment.replies = replies;
    }

    threadDetails.comments = threadComments;
    return threadDetails;
  }

  _verifyPayload({ threadId }) {
    if (!threadId) {
      throw new Error('GET_THREAD_DETAILS_USE_CASE.PAYLOAD_NOT_CONTAIN_THREAD_ID');
    }

    if (typeof threadId !== 'string') {
      throw new Error('GET_THREAD_DETAILS_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadDetailsUseCase;
