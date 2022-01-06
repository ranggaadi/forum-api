const NewThread = require('../../../Domains/threads/entities/NewThread');
const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const PostNewThreadUseCase = require('../PostNewThreadUseCase');

describe('PostNewThread use case', () => {
  it('should orchestrating the post new thread action correctly', async () => {
    const useCasePayload = {
      title: 'bintang kecil',
      body: 'dilangit yang biru',
      owner: 'user-123',
    };

    const expectedOutput = new PostedThread({
      id: 'thread-123',
      title: useCasePayload.body,
      owner: useCasePayload.owner,
    });

    // depedency use case
    const mockThreadRepo = new ThreadRepository();

    // mocking needed func
    mockThreadRepo.addThread = jest.fn().mockImplementation(() => Promise.resolve(expectedOutput));

    // creating useCase
    const postNewThreadUseCase = new PostNewThreadUseCase({
      threadRepository: mockThreadRepo,
    });

    // action
    const postedThread = await postNewThreadUseCase.execute(useCasePayload);

    expect(postedThread).toStrictEqual(expectedOutput);
    expect(mockThreadRepo.addThread).toBeCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    }));
  });
});
