const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository', () => {
  it('should throw error when invoking unimplemented method', async () => {
    const replyRepo = new ReplyRepository();

    await expect(replyRepo.verifyReplyAuthor('123', '345')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepo.verifyReplyOnCommentOnThreadById('123', '345', '678')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepo.addReplyToCommentOnThread({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepo.deleteReply('123')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepo.getReplyDetailsOnThread('123', '456')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
