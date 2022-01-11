const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyReplyOnCommentOnThreadById function', () => {
    it('should throw not found error if reply, comment or thread is not exist', async () => {
      const replyPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyPostgres.verifyReplyOnCommentOnThreadById('reply-123', 'comment-123', 'thread-123')).rejects.toThrowError(NotFoundError);
    });
    it('should throw not found error if reply or comment is not exist', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      const replyPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyPostgres.verifyReplyOnCommentOnThreadById('reply-123', 'comment-123', 'thread-123')).rejects.toThrowError(NotFoundError);
    });
    it('should throw not found error if reply is not exist', async () => {
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

      const replyPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyPostgres.verifyReplyOnCommentOnThreadById('reply-123', 'comment-123', 'thread-123')).rejects.toThrowError(NotFoundError);
    });
    it('should not throw error if replies on a comment on a thread is exist', async () => {
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

      await RepliesTableTestHelper.addReplies({
        id: 'reply-123',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const replyRepoPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepoPostgres.verifyReplyOnCommentOnThreadById('reply-123', 'comment-123', 'thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyAuthor function', () => {
    it('should throw error if reply owner isnt the same with provided second argument', async () => {
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

      await RepliesTableTestHelper.addReplies({
        id: 'reply-123',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const replyRepoPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepoPostgres.verifyReplyAuthor('reply-123', 'user-123456678')).rejects.toThrow(AuthorizationError);
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

      await RepliesTableTestHelper.addReplies({
        id: 'reply-123',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const replyRepoPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepoPostgres.verifyReplyAuthor('reply-123', 'user-123')).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('addReplyToCommentOnThread', () => {
    it('should persist the added reply correctly to database', async () => {
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

      const newReply = new NewReply({
        content: 'ini adalah balasan komentar',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const replyIdGenerator = () => '123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, replyIdGenerator);
      await replyRepositoryPostgres.addReplyToCommentOnThread(newReply);

      const addedReply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(addedReply).toHaveLength(1);
    });
    it('should return added reply correctly', async () => {
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

      const newReply = new NewReply({
        content: 'ini adalah balasan komentar',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const replyIdGenerator = () => '123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, replyIdGenerator);
      const addedReply = await replyRepositoryPostgres.addReplyToCommentOnThread(newReply);

      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'ini adalah balasan komentar',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteReply function', () => {
    it('should update the is_deleted atribute of the deleted reply correctly', async () => {
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

      await RepliesTableTestHelper.addReplies({
        id: 'reply-123',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      await replyRepository.deleteReply('reply-123');

      const softDeletedReply = await RepliesTableTestHelper.findReplyById('reply-123');

      expect(softDeletedReply).toHaveLength(1);
      expect(softDeletedReply[0].is_delete).toEqual(true);
    });
  });

  describe('getReplyDetailsOnThread function', () => {
    it('should return the details of a reply', async () => {
      const now = new Date();

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'userpertama',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'userkedua',
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
        owner: 'user-456',
        threadId: 'thread-123',
      });

      const replDate1 = new Date(now.setSeconds(now.getSeconds() + 1));
      await RepliesTableTestHelper.addReplies({
        id: 'reply-456',
        owner: 'user-456',
        threadId: 'thread-123',
        commentId: 'comment-123',
        createdAt: replDate1,
      });

      const replDate2 = new Date(now.setSeconds(now.getSeconds() + 2));
      await RepliesTableTestHelper.addReplies({
        id: 'reply-123',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        isDeleted: true,
        content: 'balasan kedua',
        createdAt: replDate2,
      });

      const replDate3 = new Date(now.setSeconds(now.getSeconds() + 3));
      await RepliesTableTestHelper.addReplies({
        id: 'reply-789',
        owner: 'user-456',
        threadId: 'thread-123',
        commentId: 'comment-456',
        content: 'balasan kedua kalinya maneh',
        createdAt: replDate3,
      });

      const replDate4 = new Date(now.setSeconds(now.getSeconds() + 4));
      await RepliesTableTestHelper.addReplies({
        id: 'reply-098',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-456',
        isDeleted: true,
        content: 'balasan kedua kalinya',
        createdAt: replDate4,
      });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      const commentReplies = await replyRepository.getReplyDetailsOnThread('thread-123', ['comment-123', 'comment-456']);

      expect(commentReplies).toHaveLength(4);
      expect(commentReplies).toStrictEqual([
        {
          id: 'reply-456',
          content: 'ini adalah sebuah balasan',
          owner: 'user-456',
          thread_id: 'thread-123',
          comment_id: 'comment-123',
          is_delete: false,
          created_at: replDate1,
          username: 'userkedua',
        },
        {
          id: 'reply-123',
          content: 'balasan kedua',
          owner: 'user-123',
          thread_id: 'thread-123',
          comment_id: 'comment-123',
          is_delete: true,
          created_at: replDate2,
          username: 'userpertama',
        },
        {
          id: 'reply-789',
          content: 'balasan kedua kalinya maneh',
          owner: 'user-456',
          thread_id: 'thread-123',
          comment_id: 'comment-456',
          is_delete: false,
          created_at: replDate3,
          username: 'userkedua',
        },
        {
          id: 'reply-098',
          content: 'balasan kedua kalinya',
          owner: 'user-123',
          thread_id: 'thread-123',
          comment_id: 'comment-456',
          is_delete: true,
          created_at: replDate4,
          username: 'userpertama',
        },
      ]);
    });
    it('should return an empty array if the thread and comment doesnt have any reply', async () => {
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

      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      const commentReplies = await replyRepository.getReplyDetailsOnThread('thread-123', ['comment-123']);

      expect(commentReplies).toHaveLength(0);
    });
  });
});
