class ReplyDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.content = payload.isDeleted ? '**balasan telah dihapus**' : payload.content;
  }

  _verifyPayload({
    id, content, date, username, isDeleted,
  }) {
    if (!id || !username || !date || !content || typeof isDeleted === 'undefined' || isDeleted === null) {
      throw new Error('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || typeof isDeleted !== 'boolean') {
      throw new Error('REPLY_DETAILS.NOT_MEET_DATA_SPECIFICATION');
    }
  }
}

module.exports = ReplyDetails;
