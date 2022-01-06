const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
  it('should throw error if not contains needed specification', () => {
    const payload = {
      id: 'comment-123',
      content: 'aku adalah anak gembala',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error if the data type provided is invalid', () => {
    const payload = {
      id: 123,
      content: [],
      owner: {},
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_SPECIFICATION');
  });
  it('should initiate AddedComment entities correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'ini adalah sebuah comment',
      owner: 'user-123',
    };

    const addedComment = new AddedComment(payload);

    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
