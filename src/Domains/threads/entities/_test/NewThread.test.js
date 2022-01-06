const NewThread = require('../NewThread');

describe('NewThread entitites', () => {
  it('should throw error if not contains needed specification', () => {
    const payload = {
      title: 'aku adalah anak gembala selalu riang serta gembira',
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error if the type data is invalid', () => {
    const payload = {
      owner: {},
      title: 123,
      body: [],
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should initialize NewThread entities correctly', () => {
    const payload = {
      owner: 'user-123',
      title: 'aku adalah anak gembala',
      body: 'selalu riang serta gembira',
    };

    const newThread = new NewThread(payload);

    expect(newThread.owner).toEqual(payload.owner);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
  });
});
