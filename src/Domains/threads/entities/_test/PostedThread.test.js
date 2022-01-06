const PostedThread = require('../PostedThread');

describe('PostedThread entities', () => {
  it('should throw error if did not meet specification', () => {
    const payload = {
      id: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      title: 'lihat kebunku penuh dengan bunga',
    };

    expect(() => new PostedThread(payload)).toThrowError('POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error if the data type is invalid', () => {
    const payload = {
      id: 123,
      title: [],
      owner: {},
    };

    expect(() => new PostedThread(payload)).toThrowError('POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create instantiation of PostedThread correctly', () => {
    const payload = {
      id: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      title: 'sebuah thread',
      owner: 'user-DWrT3pXe1hccYkV1eIAxS',
    };

    const postedThread = new PostedThread(payload);

    expect(postedThread.id).toEqual(payload.id);
    expect(postedThread.title).toEqual(payload.title);
    expect(postedThread.owner).toEqual(payload.owner);
  });
});
