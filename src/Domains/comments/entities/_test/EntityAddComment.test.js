const EntityAddComment = require('../EntityAddComment');

describe('a EntityAddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
      credentialId: 'abc',
    };

    // Action and Assert
    expect(() => new EntityAddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      credentialId: true,
      threadId: 'abc',
    };

    // Action and Assert
    expect(() => new EntityAddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create entityAddComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'dicoding',
      credentialId: 'Dicoding Indonesia',
      threadId: 'abc',
    };

    // Action
    const { content, credentialId, threadId } = new EntityAddComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(credentialId).toEqual(payload.credentialId);
    expect(threadId).toEqual(payload.threadId);
  });
});
