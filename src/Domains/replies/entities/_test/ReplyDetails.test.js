const ReplyDetails = require('../ReplyDetails');

describe('ReplyDetails entity', () => {
  it('should be throwing an error if the atributes is not provided completely', async () => {
    const examplePayload = {
      id: 'reply-123',
      username: 'username123',
      content: 'ini adalah sebuah balasan komentar',
    };

    expect(() => new ReplyDetails(examplePayload)).toThrowError('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should be throwing an error if the provided attributes contains invalid data types', async () => {
    const examplePayload = {
      id: {},
      username: 123,
      date: [],
      content: 123,
      isDeleted: [],
    };

    expect(() => new ReplyDetails(examplePayload)).toThrowError('REPLY_DETAILS.NOT_MEET_DATA_SPECIFICATION');
  });
  it('should initiate ReplyDetails entity correctly', async () => {
    const examplePayload = {
      id: 'reply-123',
      username: 'sebuahuser123',
      date: '2021-08-08T07:22:33.555Z',
      content: 'testing',
      isDeleted: false,
    };

    const commentDetails = new ReplyDetails(examplePayload);

    expect(commentDetails.id).toEqual(examplePayload.id);
    expect(commentDetails.username).toEqual(examplePayload.username);
    expect(commentDetails.date).toEqual(examplePayload.date);
    expect(commentDetails.content).toEqual(examplePayload.content);
  });
});
