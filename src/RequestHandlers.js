require('dependency-binder')({
    'SlotProvider': require('./SlotProvider'),
    'GitHubClient': require('./GitHubClient'),
    'SSMLResponder': require('./SSMLResponder'),
    'PlainTextResponder': require('./PlainTextResponder')
});

var ssmlProvider = binder.resolve('SSMLResponder');
var slotProvider = binder.resolve('SlotProvider');
var client = binder.resolve('GitHubClient');
var plainTextResponder = binder.resolve('PlainTextResponder');

module.exports = {
    handleWelcomeRequest: function(response) {
        plainTextResponder.promptWelcomeResponse(response);
    },
    handleHelpRequest: function(response) {
        plainTextResponder.promptHelpResponse(response);
    },
    handleStopIntent: function(response) {
        plainTextResponder.promptStopResponse(response);
    },
    handleCreateRepositoryRequest: function(intent, session, response) {
        var slots = slotProvider.provideCreateRepositorySlots(intent);

        if (slots.error) {
            plainTextResponder.promptSlotsErrorResponse(response);
        } else {
            var onSuccess = function() {
                plainTextResponder.promptCreateRepositoryReponse(response);
            };
            var onError = function() {
                plainTextResponder.promptApiErrorResponse(response);
            };

            client.createRepository(slots.RepositoryName.value, slots.Privacy.value, session.user.accessToken, onSuccess, onError);
        }
    },
    handleListRepositoryRequest: function(session, response) {
        var onSuccess = function(data) {
            ssmlProvider.promptListOfRepositoriesResponse(data, response);
        };
        var onError = function() {
            plainTextResponder.promptApiErrorResponse(response);
        };

        client.listMyRepositories(session.user.accessToken, onSuccess, onError);
    },
    handleListAllMyOpenIssuesRequest: function(session, response) {
        var onSuccess = function(data) {
            ssmlProvider.promptListOfIssuesResponse(data, response);
        };
        var onError = function() {
            plainTextResponder.promptApiErrorResponse(response);
        };

        client.listAllMyOpenIssues(session.user.accessToken, onSuccess, onError);
    },
    handleGetLatestCommitRequest: function(intent, session, response) {

        var latestCommitSlot = slotProvider.provideLatestCommitSlots(intent);

        if (latestCommitSlot.error) {
            plainTextResponder.promptSlotsErrorResponse(response);
        } else {
            var onError = function() {
                plainTextResponder.promptApiErrorResponse(response);
            };
            var onSuccess = function(output) {
                client.getLatestCommit(latestCommitSlot.value, output.login, session.user.accessToken, function(commits) {
                    var latestCommit = commits[0];
                    plainTextResponder.promptLatestCommitResponse(latestCommitSlot.value, latestCommit.commit.committer.name, latestCommit.commit.message, output.login, response);
                }, onError);
            };

            client.getMyInfo(session.user.accessToken, onSuccess, onError);
        }
    }
}
