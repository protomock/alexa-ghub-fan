var plainTextResponder = require('./PlainTextResponder');

module.exports = {
    handleLatestCommitError: function(repositoryName, response, error, statusCode) {
        if (statusCode == 409) {
            plainTextResponder.promptRepoEmptyError(repositoryName, response);
        } else {
          HandleCommonGitHubErrors(response, statusCode);
        }
    },
    handleListMyRepositoriesError: function(response, error, statusCode) {
        plainTextResponder.promptApiErrorResponse(response);
    },
    handleListAllMyOpenIssuesError: function(response, error, statusCode) {
        plainTextResponder.promptApiErrorResponse(response);
    },
    handleCreateRepositoryError: function(repositoryName, response, error, statusCode) {
        if (statusCode == 422) {
            plainTextResponder.promptRepoAlreadyExistsError(repositoryName, response);
        } else {
            HandleCommonGitHubErrors(response, statusCode);
        }
    },
    handleGetMyInfoError: function(response, error, statusCode) {
        HandleCommonGitHubErrors(response, statusCode);
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
