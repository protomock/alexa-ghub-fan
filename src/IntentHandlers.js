require('dependency-binder')({
    'RequestHandlers': require('./RequestHandlers'),
});

var RequestHandlers = binder.resolve('RequestHandlers');

module.exports = {
    "ListMyRepositoriesIntent": function(intent, session, response) {
        RequestHandlers.handleListRepositoryRequest(session, response);
    },
    "CreateRepositoryIntent": function(intent, session, response) {
        RequestHandlers.handleCreateRepositoryRequest(intent, session, response);
    },
    "ListAllMyOpenIssuesIntent": function(intent, session, response) {
        RequestHandlers.handleListAllMyOpenIssuesRequest(session, response);
    },
    "GetLatestCommitIntent": function(intent, session, response) {
        RequestHandlers.handleGetLatestCommitRequest(intent, session, response);
    },
    "AMAZON.HelpIntent": function(intent, session, response) {
        RequestHandlers.handleHelpRequest(response);
    },
    "AMAZON.StopIntent": function(intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function(intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
}
