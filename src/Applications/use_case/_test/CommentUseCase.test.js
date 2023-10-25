const CommentUseCase = require('../CommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const EntityAddComment = require('../../../Domains/comments/entities/EntityAddComment');

describe('CommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('1.should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content:'content thread', credentialId:'user-123', threadId:'thread-123',
    };

    const mockAddedComment = {
      id:'comment-123', content:useCasePayload.content, owner:useCasePayload.credentialId,
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();// domain
    const mockThreadRepository = new ThreadRepository();


    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    /** creating use case instance */
    const commentUseCase = new CommentUseCase({
       commentRepository: mockCommentRepository,
       threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await commentUseCase.addComment(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual({
      id:'comment-123', content:useCasePayload.content, owner:useCasePayload.credentialId,
    });

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(new EntityAddComment({
      content:useCasePayload.content, credentialId:useCasePayload.credentialId, threadId:useCasePayload.threadId,
    }));
  });

  it('2.should orchestrating the deleteComment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      credentialId:'user-123', threadId:'thread-123', commentId:'comment-123',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();// domain
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await commentUseCase.deleteComment(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      useCasePayload.credentialId,useCasePayload.commentId,
    );
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      useCasePayload.commentId,
    );
  });

});
