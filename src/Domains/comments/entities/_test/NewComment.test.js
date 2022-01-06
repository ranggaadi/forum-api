const NewComment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw error if not contains needed specification', () => {
    const payload = {
      content: 'aku adalah anak gembala',
      owner: 'user-123',
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error if the data type provided is invalid', () => {
    const payload = {
      content: 123,
      threadId: [],
      owner: {},
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_SPECIFICATION');
  });
  it('should initiate NewComment entities correctly', () => {
    const payload = {
      content: 'aku adalah anak gembala selalu riang serta gembira',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const newComment = new NewComment(payload);

    expect(newComment.content).toEqual(payload.content);
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.owner).toEqual(payload.owner);
  });
});
