const CommentDetails = require('../CommentDetails');

describe('Comment Details entity', () => {
  it('should be throwing an error if the atributes is not provided completely', async () => {
    const examplePayload = {
      id: 'comment-123',
      username: 'username123',
      content: 'ini adalah sebuah content',
    };

    expect(() => new CommentDetails(examplePayload)).toThrowError('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should be throwing an error if the provided attributes contains invalid data types', async () => {
    const examplePayload = {
      id: {},
      username: 123,
      date: [],
      content: 123,
      isDeleted: 'string',
      replies: true,
    };

    expect(() => new CommentDetails(examplePayload)).toThrowError('COMMENT_DETAILS.NOT_MEET_DATA_SPECIFICATION');
  });
  it('should initiate CommentDetails entity correctly', async () => {
    const examplePayload1 = {
      id: 'comment-123',
      username: 'sebuahuser123',
      date: '2021-08-08T07:22:33.555Z',
      content: 'testing',
      isDeleted: false,
      replies: [],
    };

    const examplePayload2 = {
      id: 'comment-456',
      username: 'sebuahuser123',
      date: '2021-08-08T07:22:33.555Z',
      content: 'testing kedua',
      isDeleted: true,
      replies: [],
    };

    const commentDetails1 = new CommentDetails(examplePayload1);
    const commentDetails2 = new CommentDetails(examplePayload2);

    expect(commentDetails1.id).toEqual(examplePayload1.id);
    expect(commentDetails1.username).toEqual(examplePayload1.username);
    expect(commentDetails1.date).toEqual(examplePayload1.date);
    expect(commentDetails1.content).toEqual(examplePayload1.content);
    expect(commentDetails1.replies).toEqual(examplePayload1.replies);

    expect(commentDetails2.id).toEqual(examplePayload2.id);
    expect(commentDetails2.username).toEqual(examplePayload2.username);
    expect(commentDetails2.date).toEqual(examplePayload2.date);
    expect(commentDetails2.content).toEqual('**komentar telah dihapus**');
    expect(commentDetails2.replies).toEqual(examplePayload2.replies);
  });
});
