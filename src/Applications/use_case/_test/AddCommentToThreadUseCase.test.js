const AddCommentToThreadUseCase = require('../AddCommentToThreadUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');

describe('Add Comment to Thread use case', () => {
  it('should orchestrating add comment to a thread correctly', async () => {
    const useCasePayload = {
      content: 'ini adalah sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const expectedOutput = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    // depedency use case
    const mockThreadRepo = new ThreadRepository();
    const mockCommentRepo = new CommentRepository();

    mockThreadRepo.verifyThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepo.addCommentToThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedOutput));

    const addCommentToThreadUseCase = new AddCommentToThreadUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
    });

    // action
    const addedComment = await addCommentToThreadUseCase.execute(useCasePayload);

    expect(addedComment).toStrictEqual(expectedOutput);
    expect(mockThreadRepo.verifyThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepo.addCommentToThread).toBeCalledWith(new NewComment({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      owner: useCasePayload.owner,
    }));
  });
});
