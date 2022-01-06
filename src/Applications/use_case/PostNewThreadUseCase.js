const NewThread = require('../../Domains/threads/entities/NewThread');

class PostNewThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newThread = new NewThread(useCasePayload);
    return this._threadRepository.addThread(newThread);
  }
}

module.exports = PostNewThreadUseCase;
