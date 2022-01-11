const LikeRepository = require('../LikeRepository');

describe('LikeRepository', () => {
  it('should be throwing error if the method is not yet implemented', async () => {
    const LikeRepo = new LikeRepository({});

    await expect(LikeRepo.addLikeToComment('123', '456')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(LikeRepo.deleteLikeFromComment('123', '456')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(LikeRepo.checkIfCommentAlreadyLiked('123', '456')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(LikeRepo.countCommentLikes('123')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
