const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyToCommentUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const newReply = new NewReply(useCasePayload);
    await this._commentRepository.verifyCommentOnThreadById(newReply.commentId, newReply.threadId);
    return this._replyRepository.addReplyToCommentOnThread(newReply);
  }
}

module.exports = AddReplyToCommentUseCase;
