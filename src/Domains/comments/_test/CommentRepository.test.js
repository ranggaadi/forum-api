const CommentRepository = require('../CommentRepository');

describe('CommentRepository', () => {
  it('should throw error when invoking unimplemented method', async () => {
    const commentRepo = new CommentRepository();

    await expect(commentRepo.verifyCommentById('123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepo.verifyCommentAuthor('123', '345')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepo.verifyCommentOnThreadById('123', '345')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepo.addCommentToThread({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepo.deleteCommentFromThread('123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepo.getCommentDetailsOnThread('123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
