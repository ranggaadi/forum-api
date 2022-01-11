const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLikeToComment(commentId, userId) {
    const id = `likes-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3) returning comment_id, owner',
      values: [id, userId, commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteLikeFromComment(commentId, userId) {
    const query = {
      text: 'DELETE FROM likes WHERE owner=$1 AND comment_id=$2',
      values: [userId, commentId],
    };

    await this._pool.query(query);
  }

  async checkIfCommentAlreadyLiked(commentId, userId) {
    const query = {
      text: 'SELECT * FROM likes WHERE owner=$1 AND comment_id=$2',
      values: [userId, commentId],
    };

    const result = await this._pool.query(query);
    return result.rows.length === 1;
  }

  async countCommentLikes(commentIds) {
    const query = {
      text: 'SELECT comment_id, COUNT(*) FROM likes WHERE comment_id=ANY($1::text[]) GROUP BY comment_id',
      values: [commentIds],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = LikeRepositoryPostgres;
