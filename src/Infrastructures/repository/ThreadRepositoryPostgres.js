
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(entityAddThread){
    const { title, body, credentialId } = entityAddThread;
    const id = `thread-${this._idGenerator()}`;
    const date =   new Date().toISOString();
    
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, credentialId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async verifyAvailableThread(threadId){
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('threadId tidak tersedia');
    }
  }

  async getThreadById(threadId){
    
    const query = {
      text: `SELECT threads.*, users.username      
      FROM threads 
      LEFT JOIN users ON users.id = threads.owner
      WHERE threads.id = $1`,
      values: [threadId],
    };
    const result = await this._pool.query(query);

    return result.rows[0];
  }

}

module.exports = ThreadRepositoryPostgres;
