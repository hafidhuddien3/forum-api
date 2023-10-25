
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(entityAddComment){
    const { content, credentialId:owner, threadId:threadid } = entityAddComment;
    const id = `comment-${this._idGenerator()}`;
    const date =   new Date().toISOString();
    const is_delete = 'no';

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [
        id,
        owner,
        date,
        content,
        threadid,
        is_delete],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async verifyCommentOwner(credentialId , commentId){
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    const Comment = result.rows[0];
    
    if (Comment.owner !== credentialId) {
      throw new AuthorizationError('Hanya pemilik comment yang bisa menghapus comment');
    }
  }

  async verifyAvailableComment(commentId){
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment tidak tersedia');
    }
  }
  
  async deleteComment(commentId){
    const is_delete = 'yes';
    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2 RETURNING id',
      values: [is_delete, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  } 

  async getCommentsByThreadId(threadId){
    const query4 = {
      text: `SELECT comments.*, users.username
    FROM comments
    LEFT JOIN users ON users.id = comments.owner
    WHERE comments.threadid = $1
    ORDER BY comments.date
    `,
      values: [threadId],
    };
    const resultComment = await this._pool.query(query4);
    return resultComment.rows;
  }
}

module.exports = CommentRepositoryPostgres;
