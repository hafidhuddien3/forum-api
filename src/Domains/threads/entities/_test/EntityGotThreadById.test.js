const EntityGotThreadById = require('../EntityGotThreadById');

describe('a EntityGotThreadById entities', () => {
  it('should create entityGotThreadById object correctly', () => {
    // Arrange
    const thread=
      {
        id: 'thread-7XIBGVGZpwxc2i6BQqKKZ',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2023-10-12T05:46:48.262Z',
        username: 'dicoding',}

    const comments= [
      {
        id: 'comment-ZpFB225rNh-_GuWeYIc9K',
        username: 'dicoding',
        date: '2023-10-12T05:46:48.361Z',
        content: 'sebuah comment',
        is_delete:'no',
      },
      {
        id: 'comment-1fkIvSZ4-RgtmLwJPOHmd',
        username: 'dicoding',
        date: '2023-10-12T05:46:48.476Z',
        content: 'sebuah comment',
        is_delete:'yes',
      }
    ]

    // Action
    const entityGotThreadById = new EntityGotThreadById(thread, comments);

    // Assert
    expect(entityGotThreadById).toEqual({
      id: 'thread-7XIBGVGZpwxc2i6BQqKKZ',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2023-10-12T05:46:48.262Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-ZpFB225rNh-_GuWeYIc9K',
          username: 'dicoding',
          date: '2023-10-12T05:46:48.361Z',
          content: 'sebuah comment',
        },
        {
          id: 'comment-1fkIvSZ4-RgtmLwJPOHmd',
          username: 'dicoding',
          date: '2023-10-12T05:46:48.476Z',
          content: '**komentar telah dihapus**',
        }]
    });

  });
});
