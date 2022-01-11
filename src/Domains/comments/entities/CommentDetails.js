class CommentDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.content = payload.isDeleted ? '**komentar telah dihapus**' : payload.content;
    this.likeCount = payload.likeCount;
    this.replies = payload.replies;
  }

  _verifyPayload(payload) {
    const {
      id, username, date, content, likeCount, replies, isDeleted,
    } = payload;

    if (!id || !username || !date || !content || typeof likeCount === 'undefined' || likeCount === null || !replies || typeof isDeleted === 'undefined' || isDeleted === null) {
      throw new Error('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || typeof likeCount !== 'number' || !Array.isArray(replies) || typeof isDeleted !== 'boolean') {
      throw new Error('COMMENT_DETAILS.NOT_MEET_DATA_SPECIFICATION');
    }
  }
}

module.exports = CommentDetails;
