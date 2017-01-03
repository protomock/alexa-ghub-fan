const MATCHER_KEY = 'name';
const OWNER_KEY = 'owner';
require('dependency-binder')({
    'SlotProvider': require('./SlotProvider'),
    'GitHubClient': require('./GitHubClient'),
    'SSMLResponder': require('./SSMLResponder'),
    'PlainTextResponder': require('./PlainTextResponder'),
    'StringMatcher': require('./StringMatcher'),
});

var ssmlProvider = binder.resolve('SSMLResponder');
var slotProvider = binder.resolve('SlotProvider');
var client = binder.resolve('GitHubClient');
var plainTextResponder = binder.resolve('PlainTextResponder');
var stringMatcher = binder.resolve('StringMatcher');

function getUserInfo(session, done) {
    var onSuccess = function(data) {
        session.attributes[OWNER_KEY] = data.login;
        console.log("handleSessionStarted => session.attributes[OWNER_KEY] = " + session.attributes[OWNER_KEY]);
        if (done) {
            done();
        }
    };
    client.getMyInfo(session.user.accessToken, onSuccess, null);
}

module.exports = {
    handleSessionStarted: function(sessionStartedRequest, session) {
        if (sessionStartedRequest.type != 'LaunchRequest') {
            getUserInfo(session);
        }
    },
    handleWelcomeRequest: function(session, response) {
        getUserInfo(session, function() {
            plainTextResponder.promptWelcomeResponse(response);
        });
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
        console.log(JSON.stringify(session));
        var latestCommitSlot = slotProvider.provideLatestCommitSlots(intent);

        if (latestCommitSlot.error) {
            plainTextResponder.promptSlotsErrorResponse(response);
        } else {
            var onError = function(error) {
                plainTextResponder.promptApiErrorResponse(response);
            };
            var onSuccess = function(data) {
                var repositoryName = stringMatcher.match(data, MATCHER_KEY, latestCommitSlot.value);
                client.getLatestCommit(repositoryName, session.attributes[OWNER_KEY], session.user.accessToken, function(commits) {
                    var latestCommit = commits[0];
                    plainTextResponder.promptLatestCommitResponse(repositoryName, latestCommit.commit.committer.name, latestCommit.commit.message, response);
                }, onError);
            };

            client.listMyRepositories(session.user.accessToken, onSuccess, onError);
        }
    }
}
