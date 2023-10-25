class EntityAddThread {
    constructor(payload) {
      this._verifyPayload(payload);
  
      this.title = payload.title;
      this.body = payload.body;
      this.credentialId = payload.credentialId;
    }
  
    _verifyPayload({title, body, credentialId}) {
      //console.log('entity add thread ',title,'', body);
      if (!title || !body|| !credentialId) {
        //console.log('entity add thread');
        throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      }
  
      if (typeof title !== 'string' || typeof body !== 'string' || typeof credentialId !== 'string') {
        throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }
  
  module.exports = EntityAddThread;
  