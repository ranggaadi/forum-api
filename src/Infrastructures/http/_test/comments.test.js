const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
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
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persist comment on thread', async () => {
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        content: 'ini adalah sebuah comment',
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
        url: `/threads/${thread.id}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });
    it('should response 400  if the request body not meet the requirements', async () => {
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

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada');
    });
    it('should response 404 if the thread id is not valid or does not exist', async () => {
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        content: 'ini adalah sebuah comment',
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

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread yang dirujuk tidak ada');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and soft deleting comment on thread', async () => {
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
        url: `/threads/${thread.id}/comments/${comment.id}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
    it('should response 404 if the thread is not valid', async () => {
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

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment pada thread yang dirujuk tidak ada');
    });
    it('should response 404 if the comment is not valid', async () => {
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

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/comment-123`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment pada thread yang dirujuk tidak ada');
    });
    it('should response 403 if the comment wants to be deleted is not by owner', async () => {
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
        url: `/threads/${thread.id}/comments/${comment.id}`,
        headers: { Authorization: `Bearer ${falseUserAccessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak memiliki akses untuk menghapus comment ini.');
    });
  });
});
