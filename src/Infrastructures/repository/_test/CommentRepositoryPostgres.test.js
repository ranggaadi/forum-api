const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentDetails = require('../../../Domains/comments/entities/CommentDetails');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyCommentById function', () => {
    it('should throw not found error if comment is not exist', async () => {
      const commentPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentPostgres.verifyCommentById('comment-123')).rejects.toThrowError(NotFoundError);
    });
    it('should not throw error if comment is exist', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const commentRepoPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepoPostgres.verifyCommentById('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOnThreadById function', () => {
    it('should throw not found error if thread or comment is not exist', async () => {
      const commentPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentPostgres.verifyCommentOnThreadById('comment-123', 'thread-123')).rejects.toThrowError(NotFoundError);
    });
    it('should throw not found error if comment is not exist', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      const commentPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentPostgres.verifyCommentOnThreadById('comment-123', 'thread-123')).rejects.toThrowError(NotFoundError);
    });
    it('should not throw error if comment on a thread is exist', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const commentRepoPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepoPostgres.verifyCommentOnThreadById('comment-123', 'thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentAuthor function', () => {
    it('should throw error if comment owner isnt the same with provided second argument', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const commentRepoPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepoPostgres.verifyCommentAuthor('comment-123', 'thread-123456678')).rejects.toThrow(AuthorizationError);
    });
    it('should not throw error if comment owner is same as provided second argument', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const commentRepoPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepoPostgres.verifyCommentAuthor('comment-123', 'user-123')).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('addCommentToThread function', () => {
    it('should persist the added comment correctly to database', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      const newComment = new NewComment({
        content: 'ini adalah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentIdGenerator = () => '123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, commentIdGenerator);
      await commentRepositoryPostgres.addCommentToThread(newComment);

      const addedComment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(addedComment).toHaveLength(1);
    });
    it('should return added comment correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      const newComment = new NewComment({
        content: 'ini adalah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentIdGenerator = () => '123';

      const commentRepoPostgres = new CommentRepositoryPostgres(pool, commentIdGenerator);
      const addedComment = await commentRepoPostgres.addCommentToThread(newComment);

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'ini adalah comment',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteCommentFromThread function', () => {
    it('should update the is_deleted atribute of the deleted comment correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const commentRepo = new CommentRepositoryPostgres(pool, {});
      await commentRepo.deleteCommentFromThread('comment-123');

      const softDeletedComment = await CommentsTableTestHelper.findCommentById('comment-123');

      expect(softDeletedComment).toHaveLength(1);
      expect(softDeletedComment[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentDetailsOnThread function', () => {
    it('should return the details of a comment', async () => {
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

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'ini adalah komentar',
        createdAt: now,
        owner: 'user-123',
        threadId: 'thread-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        content: 'ini adalah komentar kedua',
        createdAt: now,
        owner: 'user-123',
        threadId: 'thread-123',
        isDeleted: true,
      });

      const commentRepository = new CommentRepositoryPostgres(pool, {});
      const threadComments = await commentRepository.getCommentDetailsOnThread('thread-123');

      expect(threadComments).toHaveLength(2);
      expect(threadComments[0]).toStrictEqual(new CommentDetails({
        id: 'comment-123',
        username: 'userpertama',
        date: now.toISOString(),
        content: 'ini adalah komentar',
        likeCount: 0,
        isDeleted: false,
        replies: [],
      }));
      expect(threadComments[1]).toStrictEqual(new CommentDetails({
        id: 'comment-456',
        username: 'userpertama',
        date: now.toISOString(),
        content: 'ini adalah komentar kedua',
        likeCount: 0,
        isDeleted: true,
        replies: [],
      }));
    });
    it('should return an empty array if the thread doesnt have any comment', async () => {
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

      const commentRepository = new CommentRepositoryPostgres(pool, {});
      const threadComments = await commentRepository.getCommentDetailsOnThread('thread-123');

      expect(threadComments).toHaveLength(0);
    });
  });
});
