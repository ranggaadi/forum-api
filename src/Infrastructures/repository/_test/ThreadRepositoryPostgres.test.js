const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const ThreadDetails = require('../../../Domains/threads/entities/ThreadDetails');
const CommentDetails = require('../../../Domains/comments/entities/CommentDetails');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ReplyDetails = require('../../../Domains/replies/entities/ReplyDetails');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyThreadById', () => {
    it('should throw not found error if thread is not exist', async () => {
      const threadPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadPostgres.verifyThreadById('thread-123')).rejects.toThrowError(NotFoundError);
    });
    it('should not throw not found error if thread is exist', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      const threadPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadPostgres.verifyThreadById('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addThread function', () => {
    it('should persist the added thread correctly to database', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      const newThread = new NewThread({
        owner: 'user-123',
        title: 'aku adalah anak gembala',
        body: 'selalu riang serta gembira',
      });

      const threadIdGenerator = () => '123';

      const threadRepoPostgres = new ThreadRepositoryPostgres(pool, threadIdGenerator);
      await threadRepoPostgres.addThread(newThread);

      const insertedThread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(insertedThread).toHaveLength(1);
    });

    it('should return postedThread correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      const newThread = new NewThread({
        owner: 'user-123',
        title: 'aku adalah anak gembala',
        body: 'selalu riang serta gembira',
      });

      const threadIdGenerator = () => '123';

      const threadRepoPostgres = new ThreadRepositoryPostgres(pool, threadIdGenerator);
      const addedThread = await threadRepoPostgres.addThread(newThread);

      expect(addedThread).toStrictEqual(new PostedThread({
        id: 'thread-123',
        title: 'aku adalah anak gembala',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadDetails function', () => {
    it('should return the details of a thread', async () => {
      const now = new Date();

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'userpertama',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title thread',
        body: 'body thread',
        owner: 'user-123',
        createdAt: now,
      });

      const threadRepository = new ThreadRepositoryPostgres(pool, {});
      const threadDetails = await threadRepository.getThreadDetails('thread-123');

      expect(threadDetails).toStrictEqual(new ThreadDetails({
        id: 'thread-123',
        title: 'title thread',
        body: 'body thread',
        date: now.toISOString(),
        username: 'userpertama',
        comments: [],
      }));
    });
  });
});
