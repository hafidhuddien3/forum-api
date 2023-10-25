const EntityAddThread = require('../EntityAddThread');

describe('a EntityAddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
      body: 'abc',
    };

    // Action and Assert
    expect(() => new EntityAddThread(payload)).toThrowError
    ('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
      credentialId: 'abc',
    };

    // Action and Assert
    expect(() => new EntityAddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create entityAddThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      credentialId: 'abc',
    };

    // Action
    const { title, body, credentialId } = new EntityAddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(credentialId).toEqual(payload.credentialId);
  });
});
