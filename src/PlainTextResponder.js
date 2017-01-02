require('dependency-binder')({
    'AlexaSkill': require('./AlexaSkill')
});
var AlexaSkill = binder.resolve('AlexaSkill');

var speechOutput = {
    speech: '',
    type: AlexaSkill.speechOutputType.PLAIN_TEXT
};

var repromptOutput = {
    speech: '',
    type: AlexaSkill.speechOutputType.PLAIN_TEXT
};

module.exports = {
    promptWelcomeResponse: function(response) {
        var whatCanIdoForYou = "What can I do for you?";
        speechOutput.speech = "Welcome to GitHub Helper. " + whatCanIdoForYou;
        repromptOutput.speech = "I can help with doing things such as " +
            "creating a repo or checking latest commit." +
            whatCanIdoForYou;

        response.ask(speechOutput, repromptOutput);
    },
    promptHelpResponse: function(response) {
        var whatCanIdoForYou = "What can I do for you?";
        speechOutput.speech = "I can help with doing things such as " +
            "creating a repo or checking latest commit." +
            whatCanIdoForYou;
        repromptOutput.speech = whatCanIdoForYou;

        response.ask(speechOutput, repromptOutput);
    },
    promptStopResponse: function(response) {
        speechOutput.speech = 'Goodbye.';
        response.tell(speechOutput);
    },
    promptCreateRepositoryReponse: function(response) {
        speechOutput.speech = 'I was able to create the repo successfully.';
        response.tell(speechOutput);
    },
    promptLatestCommitResponse: function(repositoryName, committer, message, owner, response) {
        var speech = 'The latest commit for ' + repositoryName + ' is ' + message;
        if (owner == committer) {
            speech += ' made by you.';
        } else {
            speech += ' made by ' + committer + '.';
        }
        speechOutput.speech = speech;
        response.tell(speechOutput);
    },
    promptSlotsErrorResponse: function(response) {
        speechOutput.speech = 'I don\'t think I heard you quite right. Can you try again?';
        response.tell(speechOutput);
    },
    promptApiErrorResponse: function(response) {
        speechOutput.speech = 'There seems to be an issue right now. Try again later.';
        response.tell(speechOutput);
    }
}
