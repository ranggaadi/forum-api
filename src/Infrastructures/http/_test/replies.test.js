const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persist comment on thread', async () => {
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        content: 'ini adalah sebuah balasan',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({ // login
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      const { accessToken } = loginResponseJson.data;

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'aku seorang kapiten',
          body: 'aku adalah anak gembala',
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const thread = threadResponseJson.data.addedThread;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        payload: {
          content: 'ini adalah sebuah komentar',
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const commentResponseJson = JSON.parse(commentResponse.payload);
      const comment = commentResponseJson.data.addedComment;

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments/${comment.id}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });
    it('should response 404 thread or comment that want to be replied is invalid', async () => {
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        content: 'ini adalah sebuah balasan',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({ // login
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      const { accessToken } = loginResponseJson.data;

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'aku seorang kapiten',
          body: 'aku adalah anak gembala',
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const thread = threadResponseJson.data.addedThread;

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments/comment-123/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment pada thread yang dirujuk tidak ada');
    });
    it('should response 400 request body provided for replies is invalid', async () => {
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {};

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({ // login
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      const { accessToken } = loginResponseJson.data;

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'aku seorang kapiten',
          body: 'aku adalah anak gembala',
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const thread = threadResponseJson.data.addedThread;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        payload: {
          content: 'ini adalah sebuah komentar',
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const commentResponseJson = JSON.parse(commentResponse.payload);
      const comment = commentResponseJson.data.addedComment;

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments/${comment.id}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('property payload tidak lengkap');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and soft deleting reply from specified comment and thread', async () => {
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({ // login
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      const { accessToken } = loginResponseJson.data;

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'aku seorang kapiten',
          body: 'aku adalah anak gembala',
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const thread = threadResponseJson.data.addedThread;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        payload: {
          content: 'ini adalah sebuah komentar',
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const commentResponseJson = JSON.parse(commentResponse.payload);
      const comment = commentResponseJson.data.addedComment;

      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments/${comment.id}/replies`,
        payload: {
          content: 'ini adalah balasan komtentar',
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const replyResponseJson = JSON.parse(replyResponse.payload);
      const reply = replyResponseJson.data.addedReply;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${comment.id}/replies/${reply.id}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 if the reply is invalid', async () => {
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({ // login
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      const { accessToken } = loginResponseJson.data;

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'aku seorang kapiten',
          body: 'aku adalah anak gembala',
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const thread = threadResponseJson.data.addedThread;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        payload: {
          content: 'ini adalah sebuah komentar',
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const commentResponseJson = JSON.parse(commentResponse.payload);
      const comment = commentResponseJson.data.addedComment;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${comment.id}/replies/reply-123`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('reply pada comment dan thread yang dirujuk tidak ada');
    });

    it('should response 403 if the reply wants to be deleted is not by owner', async () => {
      const loginPayload = {
        username: 'realuser',
        password: 'secret',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'realuser',
          password: 'secret',
          fullname: 'Dicoding',
        },
      });

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'falseuser',
          password: 'secret',
          fullname: 'Dicoding123',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      const { accessToken } = loginResponseJson.data;

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'aku seorang kapiten',
          body: 'aku adalah anak gembala',
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const thread = threadResponseJson.data.addedThread;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        payload: {
          content: 'ini adalah sebuah komentar',
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const commentResponseJson = JSON.parse(commentResponse.payload);
      const comment = commentResponseJson.data.addedComment;

      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments/${comment.id}/replies`,
        payload: {
          content: 'ini adalah balasan komentar',
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const replyResponseJson = JSON.parse(replyResponse.payload);
      const reply = replyResponseJson.data.addedReply;

      const falseUserLoginResponse = await server.inject({ // login
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'falseuser',
          password: 'secret',
        },
      });

      const falseUserLoginResponseJson = JSON.parse(falseUserLoginResponse.payload);
      const { accessToken: falseUserAccessToken } = falseUserLoginResponseJson.data;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${comment.id}/replies/${reply.id}`,
        headers: { Authorization: `Bearer ${falseUserAccessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak memiliki akses untuk menghapus balasan komentar ini.');
    });
  });
});
