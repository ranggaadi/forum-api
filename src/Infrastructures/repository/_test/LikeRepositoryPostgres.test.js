const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    pool.end();
  });

  describe('addLikeToComment function', () => {
    it('should persist the added like to a comment correctly to database', async () => {
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

      const likeIdGenerator = () => 123;

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, likeIdGenerator);
      const likedComment = await likeRepositoryPostgres.addLikeToComment('comment-123', 'user-123');

      expect(likedComment).toHaveLength(1);
      expect(likedComment[0].comment_id).toEqual('comment-123');
      expect(likedComment[0].owner).toEqual('user-123');
    });
  });
  describe('deleteLikeFromComment function', () => {
    it('should delete like row from comment', async () => {
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

      await LikesTableTestHelper.addLikeToComment({
        id: 'like-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await likeRepositoryPostgres.deleteLikeFromComment('comment-123', 'user-123');

      const result = await LikesTableTestHelper.findLikeInComment('like-123');
      expect(result).toHaveLength(0);
    });
  });
  describe('checkIfCommentAlreadyLiked function', () => {
    it('should returning true if user already liked a comment', async () => {
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

      await LikesTableTestHelper.addLikeToComment({
        id: 'like-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const result = await likeRepositoryPostgres.checkIfCommentAlreadyLiked('comment-123', 'user-123');
      expect(result).toEqual(true);
    });
    it('should returning true if user already liked a comment', async () => {
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

      await LikesTableTestHelper.addLikeToComment({
        id: 'like-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const result = await likeRepositoryPostgres.checkIfCommentAlreadyLiked('comment-123', 'user-123');
      expect(result).toEqual(true);
    });
    it('should returning false if user never  liked a comment', async () => {
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

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const result = await likeRepositoryPostgres.checkIfCommentAlreadyLiked('comment-123', 'user-123');
      expect(result).toEqual(false);
    });
  });
  describe('countCommentLikes function', () => {
    it('should be returning the total likes from a comment', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'userpertama',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-789',
        username: 'userkedua',
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
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      await LikesTableTestHelper.addLikeToComment({
        commentId: 'comment-123',
        userId: 'user-123',
      });
      await LikesTableTestHelper.addLikeToComment({
        id: 'like-456',
        commentId: 'comment-123',
        userId: 'user-456',
      });
      await LikesTableTestHelper.addLikeToComment({
        id: 'like-789',
        commentId: 'comment-123',
        userId: 'user-789',
      });
      await LikesTableTestHelper.addLikeToComment({
        id: 'like-000',
        commentId: 'comment-456',
        userId: 'user-789',
      });

      const likeRepo = new LikeRepositoryPostgres(pool, {});
      const likeCounts = await likeRepo.countCommentLikes(['comment-123', 'comment-456']);
      expect(likeCounts).toHaveLength(2);
      expect(likeCounts.filter((likeCount) => likeCount.comment_id === 'comment-123')[0].count).toEqual('3');
      expect(likeCounts.filter((likeCount) => likeCount.comment_id === 'comment-456')[0].count).toEqual('1');
    });
    it('should be returning zero total likes from a comment if no one likes the comment', async () => {
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

      const likeRepo = new LikeRepositoryPostgres(pool, {});
      const likeCounts = await likeRepo.countCommentLikes(['comment-123']);
      expect(likeCounts).toHaveLength(0);
    });
  });
});
