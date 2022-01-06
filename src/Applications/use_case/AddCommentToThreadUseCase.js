const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentToThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const newComment = new NewComment(useCasePayload);
    await this._threadRepository.verifyThreadById(newComment.threadId);
    return this._commentRepository.addCommentToThread(newComment);
  }
}

module.exports = AddCommentToThreadUseCase;
