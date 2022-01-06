const ThreadDetails = require('../ThreadDetails');

describe('Thread details entitiy', () => {
  it('should throwing error if the required attribute is not fulfilled', () => {
    const examplePayload = {
      id: 'thread-123',
      body: 'test body',
      username: 'dicoding',
    };

    expect(() => new ThreadDetails(examplePayload)).toThrowError('THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throwing error if the attribute data type is not valid', () => {
    const examplePayload = {
      id: 123,
      title: true,
      body: {},
      date: [],
      username: 456,
      comments: true,
    };

    expect(() => new ThreadDetails(examplePayload)).toThrowError('THREAD_DETAILS.NOT_MEET_DATA_SPECIFICATION');
  });
  it('should initiate Thread Details entity correctly', () => {
    const examplePayload = {
      id: 'thread-123',
      title: 'test title',
      body: 'test body',
      date: '2021-08-08T07:22:33.555Z',
      username: 'dicoding',
      comments: [],
    };

    const threadDetails = new ThreadDetails(examplePayload);

    expect(threadDetails.id).toEqual(examplePayload.id);
    expect(threadDetails.title).toEqual(examplePayload.title);
    expect(threadDetails.body).toEqual(examplePayload.body);
    expect(threadDetails.date).toEqual(examplePayload.date);
    expect(threadDetails.username).toEqual(examplePayload.username);
    expect(threadDetails.comments).toEqual(examplePayload.comments);
  });
});
