const EntityAddComment = require('../../Domains/comments/entities/EntityAddComment');

class CommentUseCase {
    constructor({ commentRepository, threadRepository }) {
      this._commentRepository = commentRepository;
      this._threadRepository = threadRepository;
    }
   
    
    async addComment({content, credentialId, threadId}) {
      const payload={content, credentialId, threadId};
      const entityAddComment = new EntityAddComment(payload);
      await this._threadRepository.verifyAvailableThread(threadId);
      return this._commentRepository.addComment(entityAddComment);
    }
   
    
    async deleteComment({credentialId, threadId, commentId}) {
      await this._threadRepository.verifyAvailableThread(threadId);
      await this._commentRepository.verifyAvailableComment(commentId);
      await this._commentRepository.verifyCommentOwner(credentialId, commentId);
      return this._commentRepository.deleteComment(commentId);
    }
   
  }
  module.exports = CommentUseCase;