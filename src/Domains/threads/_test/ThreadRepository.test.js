const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository', () => {
  it('should throw error when invoking unimplemented method', async () => {
    const threadRepo = new ThreadRepository();

    await expect(threadRepo.verifyThreadById('123')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepo.addThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepo.getThreadDetails('123')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
