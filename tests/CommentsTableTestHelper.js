/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id=$1',
      values: [id],
    };

    const res = await pool.query(query);
    return res.rows;
  },

  async addComment({
    id = 'comment-123', content = 'ini adalah sebuah komentar', owner = 'user-123', threadId = 'thread-123', isDeleted = false, createdAt = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, threadId, isDeleted, createdAt],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
