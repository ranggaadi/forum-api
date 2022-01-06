/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async cleanTable() {
    await pool.query('DELETE from threads WHERE 1=1');
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * from threads WHERE id = $1',
      values: [id],
    };

    const res = await pool.query(query);
    return res.rows;
  },

  async addThread({
    id = 'thread-123', title = 'anak gembala', body = 'aku adalah anak gembala', owner = 'user-123', createdAt = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, owner, createdAt],
    };

    await pool.query(query);
  },
};

module.exports = ThreadsTableTestHelper;
