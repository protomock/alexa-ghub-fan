const PRIVATE = 'private';

var restManager,
    errorHandlers,
    self;

function GitHubClient(response) {
    this.response = response;
    errorHandlers = require('./GitHubClientErrorHandler');
    restManager = require('./RestManager');
    self = this;
}

GitHubClient.prototype = {
    createRepository: function(name, privacy, accessToken, onSuccess, onError) {
        var data = {
            name: name,
            description: 'This repository was created by Alexa!',
            private: privacy == PRIVATE ? true : false,
            has_issues: true,
            has_wiki: true,
            has_downloads: true
        };
        var onError = function(error, statusCode) {
            console.log(error + " => " + statusCode);
            errorHandlers.handleCreateRepositoryError(name, self.response, error, statusCode);
        };
        restManager.makeRequest('POST', '/user/repos', data, accessToken, onSuccess, onError);
    },
    listMyRepositories: function(accessToken, onSuccess) {
        var onError = function(error, statusCode) {
            errorHandlers.handleListMyRepositoriesError(self.response, error, statusCode);
        };
        restManager.makeRequest('GET', '/user/repos', null, accessToken, onSuccess, onError);
    },
    listAllMyOpenIssues: function(accessToken, onSuccess) {
        var onError = function(error, statusCode) {
            errorHandlers.handleListAllMyOpenIssuesError(self.response, error, statusCode);
        };
        restManager.makeRequest('GET', '/issues', null, accessToken, onSuccess, onError);
    },
    getMyInfo: function(accessToken, onSuccess) {
        var onError = function(error, statusCode) {
            errorHandlers.handleGetMyInfoError(self.response, error, statusCode);
        };
        restManager.makeRequest('GET', '/user', null, accessToken, onSuccess, onError);
    },
    getLatestCommit: function(name, owner, accessToken, onSuccess) {
        var path = '/repos/' + owner + '/' + name + '/commits';
        var onError = function(error, statusCode) {
            errorHandlers.handleLatestCommitError(name, self.response, error, statusCode);
        };
        restManager.makeRequest('GET', path, null, accessToken, onSuccess, onError);
    }
}

module.exports = GitHubClient;
