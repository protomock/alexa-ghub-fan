const PRIVATE = 'private'

var errorHandlerFactory = require('./ErrorHandlerFactory')
var restManager = require('./RestManager')

function GitHubClient (response) {
  this.errorHandler = errorHandlerFactory.createGitHubErrorHandler(response)
}

GitHubClient.prototype = {
  createRepository: function (name, privacy, accessToken, onSuccess) {
    var data = {
      name: name,
      description: 'This repository was created by Alexa!',
      private: privacy === PRIVATE,
      has_issues: true,
      has_wiki: true,
      has_downloads: true
    }
    var onError = function (error, statusCode) {
      this.errorHandler.handleCreateRepositoryError(name, error, statusCode)
    }
    restManager.makeRequest('POST', '/user/repos', data, accessToken, onSuccess, onError)
  },
  listMyRepositories: function (accessToken, onSuccess) {
    restManager.makeRequest('GET', '/user/repos', null, accessToken, onSuccess, this.errorHandler.handleListMyRepositoriesError)
  },
  listAllMyOpenIssues: function (accessToken, onSuccess) {
    restManager.makeRequest('GET', '/issues', null, accessToken, onSuccess, this.errorHandler.handleListAllMyOpenIssuesError)
  },
  getMyInfo: function (accessToken, onSuccess) {
    restManager.makeRequest('GET', '/user', null, accessToken, onSuccess, this.errorHandler.handleGetMyInfoError)
  },
  getLatestCommit: function (name, owner, accessToken, onSuccess) {
    var path = '/repos/' + owner + '/' + name + '/commits'
    var onError = function (error, statusCode) {
      this.errorHandler.handleLatestCommitError(name, error, statusCode)
    }
    restManager.makeRequest('GET', path, null, accessToken, onSuccess, onError)
  }
}

module.exports = GitHubClient
