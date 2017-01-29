
var requestHandlers = require('./RequestHandlers');

module.exports = {
    "ListMyRepositoriesIntent": function(intent, session, response) {
        requestHandlers.handleListRepositoryRequest(session, response);
    },
    "CreateRepositoryIntent": function(intent, session, response) {
        requestHandlers.handleCreateRepositoryRequest(intent, session, response);
    },
    "ListAllMyOpenIssuesIntent": function(intent, session, response) {
        requestHandlers.handleListAllMyOpenIssuesRequest(session, response);
    },
    "GetLatestCommitIntent": function(intent, session, response) {
        requestHandlers.handleGetLatestCommitRequest(intent, session, response);
    },
    "AMAZON.HelpIntent": function(intent, session, response) {
        requestHandlers.handleHelpRequest(response);
    },
    "AMAZON.StopIntent": function(intent, session, response) {
        requestHandlers.handleStopIntent(response);
    },
    "AMAZON.CancelIntent": function(intent, session, response) {
        requestHandlers.handleStopIntent(response);
    }
}
