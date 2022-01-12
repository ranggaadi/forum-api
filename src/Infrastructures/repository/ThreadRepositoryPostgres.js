const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const PostedThread = require('../../Domains/threads/entities/PostedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadDetails = require('../../Domains/threads/entities/ThreadDetails');
const ReplyDetails = require('../../Domains/replies/entities/ReplyDetails');
const CommentDetails = require('../../Domains/comments/entities/CommentDetails');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyThreadById(id) { // thread
    const query = {
      text: 'SELECT * FROM threads WHERE id=$1',
      values: [id],
    };

    const res = await this._pool.query(query);
    if (!res.rowCount) {
      throw new NotFoundError('thread yang dirujuk tidak ada');
    }
  }

  async addThread({ owner, title, body }) { // thread
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };

    const res = await this._pool.query(query);

    return new PostedThread({
      id: res.rows[0].id,
      title: res.rows[0].title,
      owner: res.rows[0].owner,
    });
  }

  async getThreadDetails(threadId) {
    const query = {
      text: `SELECT threads.*, users.username 
        FROM threads 
        LEFT JOIN users ON threads.owner=users.id 
        WHERE threads.id = $1`,
      values: [threadId],
    };

    const res = await this._pool.query(query);

    return new ThreadDetails({
      id: res.rows[0].id,
      title: res.rows[0].title,
      body: res.rows[0].body,
      date: res.rows[0].created_at.toISOString(),
      username: res.rows[0].username,
      comments: [],
    });
  }
}

module.exports = ThreadRepositoryPostgres;
