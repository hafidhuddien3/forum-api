
const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');
const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadsHandler = this.postThreadsHandler.bind(this);
    this.postInThreadCommentsHandler = this.postInThreadCommentsHandler.bind(this);
    this.deleteInThreadCommentsHandler = this.deleteInThreadCommentsHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);

  }

  async postThreadsHandler(request, h) {
    const {title, body}=request.payload
    const { id: credentialId } = request.auth.credentials;
//console.log('1');
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    //console.log('2');
    const addedThread = await threadUseCase.addThread({title, body, credentialId});
    //console.log('3');
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postInThreadCommentsHandler(request, h) {
    const { threadId } = request.params;
    const { content } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    const addedComment = await commentUseCase.addComment({content, credentialId, threadId});

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteInThreadCommentsHandler(request, h) {
    const { commentId } = request.params;
    const { threadId } = request.params;

    const { id: credentialId } = request.auth.credentials;

    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    await commentUseCase.deleteComment({credentialId, threadId, commentId});

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async getThreadByIdHandler(request) {
    const { threadId } = request.params;

    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const thread= await threadUseCase.getThreadById({threadId});
    

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }

}

module.exports = ThreadsHandler;
