var plainTextResponder = require('./PlainTextResponder');

function GitHubClientErrorHandler(response) {
  this.response = response
}

GitHubClientErrorHandler.prototype = {
    handleLatestCommitError: function(repositoryName, error, statusCode) {
        if (statusCode == 409) {
            plainTextResponder.promptRepoEmptyError(repositoryName, this.response);
        } else {
          HandleCommonGitHubErrors(this.response, statusCode);
        }
    },
    handleListMyRepositoriesError: function(error, statusCode) {
        plainTextResponder.promptApiErrorResponse(this.response);
    },
    handleListAllMyOpenIssuesError: function(error, statusCode) {
        plainTextResponder.promptApiErrorResponse(this.response);
    },
    handleCreateRepositoryError: function(repositoryName, error, statusCode) {
        if (statusCode == 422) {
            plainTextResponder.promptRepoAlreadyExistsError(repositoryName, this.response);
        } else {
            HandleCommonGitHubErrors(this.response, statusCode);
        }
    },
    handleGetMyInfoError: function(error, statusCode) {
        HandleCommonGitHubErrors(this.response, statusCode);
    }
};


function HandleCommonGitHubErrors(response, statusCode) {
    switch (statusCode) {
        case 401:
            plainTextResponder.promptAccountReLinkResponse(response);
            break;
        default:
            plainTextResponder.promptApiErrorResponse(response);
    }
}


module.exports = GitHubClientErrorHandler;
