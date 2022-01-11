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
      likeCount: 'string',
      replies: true,
    };

    expect(() => new CommentDetails(examplePayload)).toThrowError('COMMENT_DETAILS.NOT_MEET_DATA_SPECIFICATION');
  });
  it('should initiate CommentDetails entity correctly and show comment content when the comment isn\'t deleted', async () => {
    const examplePayload = {
      id: 'comment-123',
      username: 'sebuahuser123',
      date: '2021-08-08T07:22:33.555Z',
      content: 'testing',
      isDeleted: false,
      likeCount: 5,
      replies: [],
    };

    const commentDetails1 = new CommentDetails(examplePayload);

    expect(commentDetails1.id).toEqual(examplePayload.id);
    expect(commentDetails1.username).toEqual(examplePayload.username);
    expect(commentDetails1.date).toEqual(examplePayload.date);
    expect(commentDetails1.content).toEqual(examplePayload.content);
    expect(commentDetails1.replies).toEqual(examplePayload.replies);
  });
  it('should initiate CommentDetails entity correctly, and display deleted comment', async () => {
    const examplePayload = {
      id: 'comment-456',
      username: 'sebuahuser123',
      date: '2021-08-08T07:22:33.555Z',
      content: 'testing kedua',
      likeCount: 2,
      isDeleted: true,
      replies: [],
    };

    const commentDetails2 = new CommentDetails(examplePayload);

    expect(commentDetails2.id).toEqual(examplePayload.id);
    expect(commentDetails2.username).toEqual(examplePayload.username);
    expect(commentDetails2.date).toEqual(examplePayload.date);
    expect(commentDetails2.content).toEqual('**komentar telah dihapus**');
    expect(commentDetails2.replies).toEqual(examplePayload.replies);
  });
});
