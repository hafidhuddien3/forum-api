
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const { nanoid:idGenerator } = require('nanoid');

const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTableThreadsAndUsers();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add thread to database', async () => {
      // Arrange

      const registerUser={ username:'abc', password:'password', fullname:'abc defg' };
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, idGenerator);
      const addedUser = await userRepositoryPostgres.addUser(registerUser);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);
      const entityAddThread = { title:'title', body:'body', credentialId:addedUser.id};

      // Action 
      const object =await threadRepositoryPostgres.addThread(entityAddThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThread(object.id);
      expect(thread).toHaveLength(1);
      expect(thread[0].title).toBe(entityAddThread.title);
      expect(thread[0].body).toBe(entityAddThread.body);
      expect(thread[0].owner).toBe(addedUser.id);
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError if thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);
      const threadId = 'thread-123';

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread(threadId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if thread found', async () => {
      // Arrange
           
      const registerUser={ username:'abc', password:'password', fullname:'abc defg' };
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, idGenerator);
      const addedUser = await userRepositoryPostgres.addUser(registerUser);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);
      const entityAddThread = { title:'title', body:'body', credentialId:addedUser.id};
      const addedThread = await threadRepositoryPostgres.addThread(entityAddThread);

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread(addedThread.id))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getThreadById', () => {
    it('should return thread by Id', async () => {
      // Arrange

      const registerUser={ username:'abc', password:'password', fullname:'abc defg' };
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, idGenerator);
      const addedUser = await userRepositoryPostgres.addUser(registerUser);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);
      const entityAddThread = { title:'title', body:'body', credentialId:addedUser.id};
      const addedThread = await threadRepositoryPostgres.addThread(entityAddThread);

      // Action & Assert
      const gotThread = await threadRepositoryPostgres.getThreadById(addedThread.id);
      const gotThreadWithoutDate = [gotThread].map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        username: n.username,
      }))[0];

      expect(gotThreadWithoutDate).toStrictEqual({
        id: addedThread.id,
        title: entityAddThread.title,
        body: entityAddThread.body,
        username: addedUser.username,
      });
    });
  });
  
});
