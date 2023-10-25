const EntityAddThread = require('../../Domains/threads/entities/EntityAddThread');
const EntityGotThreadById = require('../../Domains/threads/entities/EntityGotThreadById');

class ThreadUseCase {
    constructor({ threadRepository, commentRepository }) {
      this._threadRepository = threadRepository;
      this._commentRepository = commentRepository;
    }
   
    
    async addThread({title, body, credentialId}) {
      const payload={title, body, credentialId};
      const entityAddThread = new EntityAddThread(payload);
      return this._threadRepository.addThread(entityAddThread);
    }
   
    
    async getThreadById({threadId}) {
      await this._threadRepository.verifyAvailableThread(threadId);
      const comments = await this._commentRepository.getCommentsByThreadId(threadId)
      const thread = await this._threadRepository.getThreadById(threadId);
      const entityGotThreadById = new EntityGotThreadById(thread, comments);
      return entityGotThreadById;
    }

  }
  module.exports = ThreadUseCase;