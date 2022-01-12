const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  beforeEach(() => {
    jest.setTimeout(60000);
  });
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persist thread', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        title: 'aku seorang kapiten',
        body: 'aku adalah anak gembala',
      };

      const server = await createServer(container);

      // Action
      // add user
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
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });
    it('should response 400 if the request body not meet the requirements', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        body: 'aku adalah anak gembala',
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
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and returning thread and its comment', async () => {
      const threadOwnerLoginPayload = {
        username: 'threadowner',
        password: 'secret',
      };
      const firstCommenterLoginPayload = {
        username: 'firstcommenter',
        password: 'secret',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'threadowner',
          password: 'secret',
          fullname: 'Dicoding',
        },
      });

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'firstcommenter',
          password: 'secret',
          fullname: 'Dicoding123',
        },
      });

      const ownerLoginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: threadOwnerLoginPayload,
      });

      const ownerLoginResponseJson = JSON.parse(ownerLoginResponse.payload);
      const { accessToken: ownerAccessToken } = ownerLoginResponseJson.data;

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'aku seorang kapiten',
          body: 'aku adalah anak gembala',
        },
        headers: { Authorization: `Bearer ${ownerAccessToken}` },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const thread = threadResponseJson.data.addedThread;

      const fCommLoginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: firstCommenterLoginPayload,
      });

      const fCommLoginResponseJson = JSON.parse(fCommLoginResponse.payload);
      const { accessToken: fCommAccessToken } = fCommLoginResponseJson.data;

      const firstComment = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        payload: {
          content: 'ini adalah sebuah komentar dari pengguna pertama',
        },
        headers: { Authorization: `Bearer ${fCommAccessToken}` },
      });

      const firstCommentJson = JSON.parse(firstComment.payload);
      const fComment = firstCommentJson.data.addedComment;

      await server.inject({
        method: 'PUT',
        url: `/threads/${thread.id}/comments/${fComment.id}/likes`,
        headers: { Authorization: `Bearer ${fCommAccessToken}` },
      });

      await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments/${fComment.id}/replies`,
        payload: {
          content: 'ini adalah sebuah balasan komentar dari pengguna pertama',
        },
        headers: { Authorization: `Bearer ${fCommAccessToken}` },
      });

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${thread.id}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toBeDefined();
      expect(responseJson.data.thread.title).toBeDefined();
      expect(responseJson.data.thread.body).toBeDefined();
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread.username).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].id).toBeDefined();
      expect(responseJson.data.thread.comments[0].username).toBeDefined();
      expect(responseJson.data.thread.comments[0].date).toBeDefined();
      expect(responseJson.data.thread.comments[0].content).toBeDefined();
      expect(responseJson.data.thread.comments[0].likeCount).toBeDefined();
      expect(responseJson.data.thread.comments[0].likeCount).toEqual(1);
      expect(responseJson.data.thread.comments[0].replies).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
    });
    it('should response 404 when the thread id provided is invalid', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread yang dirujuk tidak ada');
    });
  });
});
