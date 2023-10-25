class CommentRepository {
  
  async addComment(entityAddComment){
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentOwner(credentialId , commentId){
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableComment(commentId){
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  
  async deleteComment(commentId){
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  } 

  async getCommentsByThreadId(threadId){
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  } 
}

module.exports = CommentRepository;
