const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
  it('should throw error if not contains needed specification', () => {
    const payload = {
      id: 'reply-123',
      content: 'aku adalah anak gembala',
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error if the data type provided is invalid', () => {
    const payload = {
      id: 123,
      content: [],
      owner: {},
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_SPECIFICATION');
  });
  it('should initiate AddedReply entities correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'ini adalah sebuah balasan',
      owner: 'user-123',
    };

    const addedReply = new AddedReply(payload);

    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
