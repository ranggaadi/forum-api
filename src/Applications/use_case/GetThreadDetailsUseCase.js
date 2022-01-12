const ReplyDetails = require('../../Domains/replies/entities/ReplyDetails');

class GetThreadDetailsUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    await this._threadRepository.verifyThreadById(useCasePayload.threadId);
    const threadDetails = await this._threadRepository.getThreadDetails(useCasePayload.threadId);
    const threadComments = await this._commentRepository
      .getCommentDetailsOnThread(useCasePayload.threadId);
    const commentIds = threadComments.map((comment) => comment.id);
    const commentReplies = await this._replyRepository
      .getReplyDetailsOnThread(useCasePayload.threadId, commentIds);
    const commentLikeCounts = await this._likeRepository.countCommentLikes(commentIds);

    threadComments.map((comment) => {
      const replies = commentReplies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => new ReplyDetails({
          id: reply.id,
          content: reply.content,
          date: reply.created_at.toISOString(),
          username: reply.username,
          isDeleted: reply.is_delete,
        }));
      const likeCount = commentLikeCounts
        .filter((like) => like.comment_id === comment.id)
        .map((like) => like.count * 1)[0];
      Object.assign(comment, { replies, likeCount });
      return comment;
    });
    // threadComments.map(async (comment) => {
    //   const replies = await this._replyRepository
    //     .getReplyDetailsOnThread(useCasePayload.threadId, comment.id);
    //   const likeCount = await this._likeRepository.countCommentLikes(comment.id);
    //   Object.assign(comment, { replies, likeCount });
    //   return comment;
    // });

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
