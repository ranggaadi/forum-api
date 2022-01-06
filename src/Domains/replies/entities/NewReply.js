class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      content, threadId, commentId, owner,
    } = payload;

    this.content = content;
    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload({
    content, threadId, commentId, owner,
  }) {
    if (!content || !threadId || !commentId || !owner) {
      throw Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
      throw Error('NEW_REPLY.NOT_MEET_DATA_SPECIFICATION');
    }
  }
}

module.exports = NewReply;
