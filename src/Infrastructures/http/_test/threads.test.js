
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

const pool = require('../../database/postgres/pool');

const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  let thread1;
  let comment1;
  let comment2;
  let accesTokenUser1;
  let accesTokenUser2;

  beforeAll(async () => { 
    await CommentsTableTestHelper.cleanTableThreadsAndUsersAndComments();
    await AuthenticationsTableTestHelper.cleanTable();

    await addUser1();
    await getAccessToken1();
    await addUser2();
    await getAccessToken2();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTableThreadsAndUsersAndComments();
    await AuthenticationsTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
  });
  

  describe('when POST /threads', () => {
    it('should response error without authentication/login', async () => {
      // Arrange
      const requestPayload = {
        title: 'title thread',
        body: 'body thread',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toBe('Missing authentication');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'title thread',
      };
      const accessToken = accesTokenUser1;
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBe('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: true,
        body: 123,
      };
      const accessToken = accesTokenUser1;
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });

    it('add thread with authentication should response 201', async () => {
      // Arrange
      const requestPayload = {
        title: 'title thread',
        body: 'body thread',
      };
      const accessToken = accesTokenUser1;

      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      thread1 = responseJson.data.addedThread.id;
    });

  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 when no authentication', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment content',
      };
      const server = await createServer(container);
      const threadId = thread1;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toBe('Missing authentication');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const accessToken = accesTokenUser1;
      const server = await createServer(container);
      const threadId = thread1;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBe('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };
      const accessToken = accesTokenUser1;
      const server = await createServer(container);
      const threadId = thread1;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment content',
      };
      const accessToken = accesTokenUser1;
      const server = await createServer(container);
      const threadId = 'wrongThread';

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('threadId tidak tersedia');
    });
    
    it('should response 201 and add comment1 by user1', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment1 content',
      };
      const accessToken = accesTokenUser1;
      const server = await createServer(container);
      const threadId = thread1;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      comment1 = responseJson.data.addedComment.id;
    });

    it('should response 201 and add comment2 by user2', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment2 content',
      };
      const accessToken = accesTokenUser2;
      const server = await createServer(container);
      const threadId = thread1;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      comment2 = responseJson.data.addedComment.id;
    });

  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 when no authentication', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = thread1;
      const commentId = comment1;
      
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toBe('Missing authentication');
    });

    it('should response 404 if commentId not fond in database', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = thread1;
      const commentId = 'fake commentId';
      const accessToken = accesTokenUser2;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Comment tidak tersedia');
    });

    it('should response 403 if Delete by Not Owner (comment2 del by NOT user2)', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = thread1;
      const commentId = comment2;
      const accessToken = accesTokenUser1;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Hanya pemilik comment yang bisa menghapus comment');
    });

    it('should response 200 if comment owner valid (comment2 del by user2)', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = thread1;
      const commentId = comment2;
      const accessToken = accesTokenUser2;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });    
  });
  
  describe('when GET /threads/{threadId}', () => {
    it('should return 200 and thread comment', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = thread1;

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
 
      const commentsWithoutDate = responseJson.data.thread.comments.map((n) => ({
        id: n.id,
        username: n.username,
        content: n.content,
      }));
      
      const threadWithoutDate = [responseJson.data.thread].map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        username: n.username,
        comments: commentsWithoutDate,
      }))[0];

      expect(threadWithoutDate).toStrictEqual({
        id: thread1,
        title: 'title thread',
        body: 'body thread',
        username: 'dicoding1',
        comments: [
          {
              id: comment1,
              username: 'dicoding1',
              content: 'comment1 content'
          },
          {
              id: comment2,
              username: 'dicoding2',
              content: "**komentar telah dihapus**"
          }
      ],
      });
    });
  });

  const addUser1 = async function() {
        // Arrange
        const requestPayload = {
          username: 'dicoding1',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        };
  
        const server = await createServer(container);
  
        // Action
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: requestPayload,
        });
          
        }
  
  const getAccessToken1 = async function() {
        // Arrange
        const requestPayload = {
          username: 'dicoding1',
          password: 'secret',
        };
        const server = await createServer(container);
  
        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: requestPayload,
        });
  
        // Assert
        const responseJson = JSON.parse(response.payload);
        accesTokenUser1 = responseJson.data.accessToken;
      }

      const addUser2 = async function() {
        // Arrange
        const requestPayload = {
          username: 'dicoding2',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        };
  
        const server = await createServer(container);
  
        // Action
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: requestPayload,
        });

      }
  
      const getAccessToken2 = async function() {
        // Arrange
        const requestPayload = {
          username: 'dicoding2',
          password: 'secret',
        };
        const server = await createServer(container);
  
        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: requestPayload,
        });
  
        // Assert
        const responseJson = JSON.parse(response.payload);
        accesTokenUser2 = responseJson.data.accessToken;
      }
  
    

  

});
