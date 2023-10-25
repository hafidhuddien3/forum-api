
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const { nanoid:idGenerator } = require('nanoid');

const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('CommentRepository postgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTableThreadsAndUsersAndComments();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should add comment to database', async () => {
      // Arrange

      const registerUser={ username:'abc', password:'password', fullname:'abc defg' };
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, idGenerator);
      const addedUser = await userRepositoryPostgres.addUser(registerUser);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);
      const entityAddThread = { title:'title', body:'body', credentialId:addedUser.id};  
      const threadReturn =await threadRepositoryPostgres.addThread(entityAddThread);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, idGenerator);
      const entityAddComment = { 
        content:'comment content', credentialId:addedUser.id, threadId:threadReturn.id};

      // Action 
      const commentReturn =await commentRepositoryPostgres.addComment(entityAddComment);

      // Assert
      const findComment = await CommentsTableTestHelper.findComment(commentReturn.id);
      expect(findComment).toHaveLength(1);
      expect(findComment[0].content).toBe(entityAddComment.content);
      expect(findComment[0].owner).toBe(entityAddComment.credentialId);
      expect(findComment[0].threadid).toBe(entityAddComment.threadId);
      expect(findComment[0].is_delete).toBe('no');
    });

  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError if not comment owner', async () => {
      // Arrange
      const registerUser={ username:'abc', password:'password', fullname:'abc defg' };
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, idGenerator);
      const addedUser = await userRepositoryPostgres.addUser(registerUser);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);
      const entityAddThread = { title:'title', body:'body', credentialId:addedUser.id};
      const threadReturn =await threadRepositoryPostgres.addThread(entityAddThread);
      
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, idGenerator);  
      const entityAddComment = { 
      content:'comment content', credentialId:addedUser.id, threadId:threadReturn.id};
      const commentReturn = await commentRepositoryPostgres.addComment(entityAddComment);
      
      const wrongCommentOwner = 'user-678';

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(wrongCommentOwner, commentReturn.id))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError if true comment owner', async () => {
      // Arrange
      const registerUser={ username:'abc', password:'password', fullname:'abc defg' };
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, idGenerator);
      const addedUser = await userRepositoryPostgres.addUser(registerUser);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);
      const entityAddThread = { title:'title', body:'body', credentialId:addedUser.id};
      const threadReturn =await threadRepositoryPostgres.addThread(entityAddThread);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, idGenerator);  
      const entityAddComment = { 
      content:'comment content', credentialId:addedUser.id, threadId:threadReturn.id};
      const commentReturn =await commentRepositoryPostgres.addComment(entityAddComment);

      const trueCommentOwner = entityAddComment.credentialId;

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(trueCommentOwner, commentReturn.id))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should throw NotFoundError if comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, idGenerator);
      const commentId = 'comment-123';

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment(commentId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if comment found', async () => {
      // Arrange
           
      const registerUser={ username:'abc', password:'password', fullname:'abc defg' };
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, idGenerator);
      const addedUser = await userRepositoryPostgres.addUser(registerUser);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);
      const entityAddThread = { title:'title', body:'body', credentialId:addedUser.id};
      const threadReturn =await threadRepositoryPostgres.addThread(entityAddThread);
      
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, idGenerator);  
      const entityAddComment = { 
        content:'comment content', credentialId:addedUser.id, threadId:threadReturn.id};
      const commentReturn =await commentRepositoryPostgres.addComment(entityAddComment);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment(commentReturn.id))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('deleteCommentRepository', () => {
    it('should soft delete comment from database', async () => {
      // Arrange
      const registerUser={ username:'abc', password:'password', fullname:'abc defg' };
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, idGenerator);
      const addedUser = await userRepositoryPostgres.addUser(registerUser);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);
      const entityAddThread = { title:'title', body:'body', credentialId:addedUser.id}; 
      const threadReturn =await threadRepositoryPostgres.addThread(entityAddThread);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, idGenerator); 
      const entityAddComment = { 
        content:'comment content', credentialId:addedUser.id, threadId:threadReturn.id};
      const commentReturn =await commentRepositoryPostgres.addComment(entityAddComment);

      // Action
      await commentRepositoryPostgres.deleteComment(commentReturn.id);

      // Assert
      const findComment = await CommentsTableTestHelper.findComment(commentReturn.id);
      expect(findComment).toHaveLength(1);
      expect(findComment[0].is_delete).toBe('yes');
    });

    it('should throw NotFondError if commentId not fond', async () => {
      // Arrange
      const registerUser={ username:'abc', password:'password', fullname:'abc defg' };
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, idGenerator);
      const addedUser = await userRepositoryPostgres.addUser(registerUser);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);
      const entityAddThread = { title:'title', body:'body', credentialId:addedUser.id}; 
      const threadReturn =await threadRepositoryPostgres.addThread(entityAddThread);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, idGenerator); 
      const entityAddComment = { 
        content:'comment content', credentialId:addedUser.id, threadId:threadReturn.id};
      await commentRepositoryPostgres.addComment(entityAddComment); 
      wrongCommentId='678';  
      
      // Action & Assert
      await expect(commentRepositoryPostgres.deleteComment(wrongCommentId)).rejects.toThrow(NotFoundError);
    });

  });

  describe('getCommentsByThreadId function', () => {
    it('should get comments correctly', async () => {
      // Arrange
           
      const registerUser={ username:'abc', password:'password', fullname:'abc defg' };
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, idGenerator);
      const addedUser = await userRepositoryPostgres.addUser(registerUser);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);
      const entityAddThread = { title:'title', body:'body', credentialId:addedUser.id};
      const threadReturn =await threadRepositoryPostgres.addThread(entityAddThread);
      
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, idGenerator);  
      const entityAddComment1 = { 
        content:'comment1 content', credentialId:addedUser.id, threadId:threadReturn.id};
      const commentReturn1 =await commentRepositoryPostgres.addComment(entityAddComment1);
      
      const entityAddComment2 = { 
        content:`comment2 content ${commentReturn1.id}`, credentialId:addedUser.id, threadId:threadReturn.id};
      const commentReturn2 =await commentRepositoryPostgres.addComment(entityAddComment2);

      // Action & Assert
      const gotComments = await commentRepositoryPostgres.getCommentsByThreadId(threadReturn.id);
      
      const gotCommentsWithoutDate = gotComments.map((n) => ({
        id: n.id,
        username: n.username,
        content: n.content,
        threadid: n.threadid,
        is_delete: n.is_delete,
      }));

      expect(gotCommentsWithoutDate).toStrictEqual([
        {
          id: commentReturn1.id,
          username: registerUser.username,
          content: entityAddComment1.content,
          threadid: threadReturn.id,
          is_delete: 'no',
        },
        {
          id: commentReturn2.id,
          username: registerUser.username,
          content: entityAddComment2.content,
          threadid: threadReturn.id,
          is_delete: 'no',
        }
      ]);


    });
  });
  
});
