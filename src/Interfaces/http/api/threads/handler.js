const GetThreadDetailsUseCase = require('../../../../Applications/use_case/GetThreadDetailsUseCase');
const PostNewThreadUseCase = require('../../../../Applications/use_case/PostNewThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler({ payload, auth }, h) {
    const postNewThreadUseCase = this._container.getInstance(PostNewThreadUseCase.name);
    const useCasePayload = {
      title: payload.title,
      body: payload.body,
      owner: auth.credentials.id,
    };
    const addedThread = await postNewThreadUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailHandler({ params }, h) {
    const getThreadDetailsUseCase = this._container
      .getInstance(GetThreadDetailsUseCase.name);

    const useCasePayload = {
      threadId: params.threadId,
    };

    const thread = await getThreadDetailsUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
