const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads endpoint ', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should return status 404 if comment on thread is doesn\'t exist ', async () => {
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
        method: 'PUT',
        url: `/threads/${thread.id}/comments/comment-123/likes`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
    it('should return status 200 and deleting or adeding likes on a comment', async () => {
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
        method: 'PUT',
        url: `/threads/${thread.id}/comments/${comment.id}/likes`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
