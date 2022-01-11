const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyDetails = require('../../Domains/replies/entities/ReplyDetails');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyReplyAuthor(replyId, authorId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id=$1 AND owner=$2',
      values: [replyId, authorId],
    };

    const res = await this._pool.query(query);

    if (!res.rowCount) {
      throw new AuthorizationError('Anda tidak memiliki akses untuk menghapus balasan komentar ini.');
    }
  }

  async verifyReplyOnCommentOnThreadById(replyId, commentId, threadId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id=$1 AND comment_id=$2 AND thread_id=$3',
      values: [replyId, commentId, threadId],
    };

    const res = await this._pool.query(query);
    if (!res.rowCount) {
      throw new NotFoundError('reply pada comment dan thread yang dirujuk tidak ada');
    }
  }

  async addReplyToCommentOnThread({
    content, threadId, commentId, owner,
  }) {
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, owner, threadId, commentId],
    };

    const res = await this._pool.query(query);

    return new AddedReply({
      id: res.rows[0].id,
      content: res.rows[0].content,
      owner: res.rows[0].owner,
    });
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete=$1 WHERE id=$2',
      values: [true, replyId],
    };

    await this._pool.query(query);
  }

  async getReplyDetailsOnThread(threadId, commentIds) {
    const query = {
      text: `SELECT replies.*, users.username 
        FROM replies 
        LEFT JOIN users ON replies.owner=users.id 
        WHERE replies.thread_id = $1 AND replies.comment_id = ANY($2::text[])
        ORDER BY created_at`,
      values: [threadId, commentIds],
    };

    const res = await this._pool.query(query);
    return res.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
