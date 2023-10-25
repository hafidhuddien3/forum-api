class EntityAddComment {
    constructor(payload) {
      this._verifyPayload(payload);
  
      const { content, credentialId, threadId } = payload;

      this.content = content;
      this.credentialId = credentialId;
      this.threadId = threadId;
    }
  
    _verifyPayload({content, credentialId, threadId}) {
      if (!content || !credentialId || !threadId) {
        throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
      }
  
      if (typeof content !== 'string' ||typeof credentialId  !== 'string' ||typeof threadId !== 'string' ) {
        throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }
  
  module.exports = EntityAddComment;
  