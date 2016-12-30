require('dependency-binder')({
    'AlexaSkill': require('./AlexaSkill'),
    'SlotProvider': require('./SlotProvider'),
    'GitHubClient': require('./GitHubClient'),
    'SSMLProvider': require('./SSMLProvider'),
    'PlainTextProvider': require('./PlainTextProvider')
});
var AlexaSkill = binder.resolve('AlexaSkill');
var ssmlProvider = binder.resolve('SSMLProvider');
var slotProvider = binder.resolve('SlotProvider');
var client = binder.resolve('GitHubClient');
var plainTextProvider = binder.resolve('PlainTextProvider');

module.exports = {
    handleWelcomeRequest: function(response) {
        var whatCanIdoForYou = "What can I do for you?",
            speechOutput = {
                speech: "Welcome to GitHub Helper. " +
                    whatCanIdoForYou,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            },
            repromptOutput = {
                speech: "I can help with doing things such as  " +
                    "creatimg a repo or checking latest commit." +
                    whatCanIdoForYou,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
        response.ask(speechOutput, repromptOutput);
    },
    handleHelpRequest: function(response) {
        var whatCanIdoForYou = "What can I do for you?",
            speechOutput = {
                speech: "I can help with doing things such as  " +
                    "creatimg a repo or checking latest commit." +
                    whatCanIdoForYou,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            },
            repromptOutput = {
                speech: whatCanIdoForYou,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };

        response.ask(speechOutput, repromptOutput);
    },
    handleCreateRepositoryRequest: function(intent, session, response) {
        var speechOutput = {
            speech: "",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var slots = slotProvider.provideCreateRepositorySlots(intent);

        if (slots.error) {
            response.tell(plainTextProvider.provideSlotsError());
        } else {
            var onSuccess = function() {
                response.tell(plainTextProvider.provideCreateRepositoryText());
            };
            var onError = function() {
                response.tell(plainTextProvider.provideApiError());
            };

            client.createRepository(slots.RepositoryName.value, slots.Privacy.value, session.user.accessToken, onSuccess, onError);
        }
    },
    handleListRepositoryRequest: function(session, response) {
        var speechOutput = {
            speech: "",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var onSuccess = function(output) {
            speechOutput.speech = ssmlProvider.provideListOfRepositoriesSSML(output);
            speechOutput.type = AlexaSkill.speechOutputType.SSML;
            response.tell(speechOutput);
        };
        var onError = function() {
            speechOutput.speech = "There seems to be an issue right now. Try again later."
            response.tell(speechOutput);
        };

        client.listMyRepositories(session.user.accessToken, onSuccess, onError);
    },
    handleListAllMyOpenIssuesRequest: function(session, response) {
        var speechOutput = {
            speech: "",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var onSuccess = function(output) {
            speechOutput.speech = ssmlProvider.provideListOfIssuesSSML(output);
            speechOutput.type = AlexaSkill.speechOutputType.SSML;
            response.tell(speechOutput);
        };
        var onError = function() {
            speechOutput.speech = "There seems to be an issue right now. Try again later."
            response.tell(speechOutput);
        };

        client.listAllMyOpenIssues(session.user.accessToken, onSuccess, onError);
    },
    handleGetLatestCommitRequest: function(intent, session, response) {

        var latestCommitSlot = slotProvider.provideLatestCommitSlots(intent);

        if (latestCommitSlot.error) {
            response.tell(plainTextProvider.provideSlotsError());
        } else {
            var onError = function() {
                response.tell(plainTextProvider.provideApiError());
            };
            var onSuccess = function(output) {
                client.getLatestCommit(latestCommitSlot.value, output.login, session.user.accessToken, function(commits) {
                    var latestCommit = commits[0];
                    var speechOutput = plainTextProvider.provideLatestCommitText(latestCommitSlot.value ,latestCommit.commit.committer.name, latestCommit.commit.message, output.login);
                    response.tell(speechOutput);
                }, onError);
            };

            client.getMyInfo(session.user.accessToken, onSuccess, onError);
        }
    }
}
