/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id=$1',
      values: [id],
    };

    const res = await pool.query(query);
    return res.rows;
  },

  async addReplies({
    id = 'reply-123', content = 'ini adalah sebuah balasan', owner = 'user-123', threadId = 'thread-123', commentId = 'comment-123', isDeleted = false, createdAt = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, owner, threadId, commentId, isDeleted, createdAt],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
