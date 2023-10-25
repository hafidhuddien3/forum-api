const ThreadUseCase = require('../ThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const EntityAddThread = require('../../../Domains/threads/entities/EntityAddThread');

describe('ThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('1.should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title:'judul thread', body:'body thread', credentialId:'user-123',
    };

    const mockAddedThread = {
      id: 'thread-123',
      title:useCasePayload.title, 
      owner:useCasePayload.credentialId,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();// domain
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    /** creating use case instance */
    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    });

    // Action
    const addedThread = await threadUseCase.addThread(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.credentialId,
    });

    expect(mockThreadRepository.addThread).toBeCalledWith(new EntityAddThread({
      title:useCasePayload.title, body:useCasePayload.body, credentialId:useCasePayload.credentialId,
    }));
  });

  it('2.should orchestrating the get Thread By Id action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId:'thread-123',
    };

    const mockGetComments= [
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
    ];

    const mockGetThread = {
      id: useCasePayload.threadId,
      title:'title thread', 
      owner:'owner thread',
      body: 'body thread',
      date: 'date thread',
      username: 'username thread',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();// domain
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetComments));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetThread));

    /** creating use case instance */
    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    });

    // Action
    const getThreadById = await threadUseCase.getThreadById(useCasePayload);
    
    // Assert
    expect(getThreadById).toEqual({
      id: useCasePayload.threadId,
      title:'title thread', 
      body: 'body thread',
      date: 'date thread',
      username: 'username thread',
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
        }],
    });

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId,
    );
  });

});
