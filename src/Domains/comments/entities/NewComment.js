class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { content, threadId, owner } = payload;

    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload({ content, threadId, owner }) {
    if (!content || !threadId || !owner) {
      throw Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw Error('NEW_COMMENT.NOT_MEET_DATA_SPECIFICATION');
    }
  }
}

module.exports = NewComment;
