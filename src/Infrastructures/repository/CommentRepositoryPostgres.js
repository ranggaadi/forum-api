const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentDetails = require('../../Domains/comments/entities/CommentDetails');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyCommentById(id) { // comment
    const query = {
      text: 'SELECT * FROM comments WHERE id=$1',
      values: [id],
    };

    const res = await this._pool.query(query);
    if (!res.rowCount) {
      throw new NotFoundError('comment yang dirujuk tidak ada');
    }
  }

  async verifyCommentAuthor(commentId, authorId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id=$1 AND owner=$2',
      values: [commentId, authorId],
    };

    const res = await this._pool.query(query);

    if (!res.rowCount) {
      throw new AuthorizationError('Anda tidak memiliki akses untuk menghapus comment ini.');
    }
  }

  async verifyCommentOnThreadById(commentId, threadId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id=$1 AND thread_id=$2',
      values: [commentId, threadId],
    };

    const res = await this._pool.query(query);
    if (!res.rowCount) {
      throw new NotFoundError('comment pada thread yang dirujuk tidak ada');
    }
  }

  async addCommentToThread({ content, threadId, owner }) {
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, owner, threadId],
    };

    const res = await this._pool.query(query);

    return new AddedComment({
      id: res.rows[0].id,
      content: res.rows[0].content,
      owner: res.rows[0].owner,
    });
  }

  async deleteCommentFromThread(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete=$1 WHERE id=$2',
      values: [true, commentId],
    };

    await this._pool.query(query);
  }

  async getCommentDetailsOnThread(threadId) {
    const query = {
      text: `SELECT comments.*, users.username 
        FROM comments 
        LEFT JOIN users ON comments.owner=users.id 
        WHERE comments.thread_id = $1
        ORDER BY created_at`,
      values: [threadId],
    };

    const res = await this._pool.query(query);

    const threadComments = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const row of res.rows) {
      threadComments.push(
        new CommentDetails({
          id: row.id,
          username: row.username,
          date: row.created_at.toISOString(),
          content: row.content,
          isDeleted: row.is_delete,
          replies: [],
        }),
      );
    }

    return threadComments;
  }
}

module.exports = CommentRepositoryPostgres;
