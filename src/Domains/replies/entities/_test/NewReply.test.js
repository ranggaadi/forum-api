const NewReply = require('../NewReply');

describe('NewReply entities', () => {
  it('should throw error if not contains needed specification', () => {
    const payload = {
      content: 'ini adalah balasan komentar',
      owner: 'user-123',
    };

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error if the data type provided is invalid', () => {
    const payload = {
      content: 123,
      threadId: [],
      commentId: {},
      owner: {},
    };

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_SPECIFICATION');
  });
  it('should initiate NewReply entities correctly', () => {
    const payload = {
      content: 'aku adalah anak gembala selalu riang serta gembira',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const newComment = new NewReply(payload);

    expect(newComment.content).toEqual(payload.content);
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.commentId).toEqual(payload.commentId);
    expect(newComment.owner).toEqual(payload.owner);
  });
});
