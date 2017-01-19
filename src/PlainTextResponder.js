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
    promptUnlinkedWelcomeResponse: function(response) {
        speechOutput.speech = 'Thanks for trying out this skill, unfortunely the features I ' +
            'provide only work if you have linked your account. ' +
            'Please take a look at the card in your alexa app for more information. ';
        response.tellWithCard(speechOutput, 'Account Link Required', 'No account linked', 'LinkAccount');
    },
    promptWelcomeResponse: function(firstName, response) {
        var whatCanIdoForYou = 'What can I do for you? ';
        speechOutput.speech = (firstName ? 'Hey ' + firstName + ', ': '') + 'Welcome to Repo Head. ' + whatCanIdoForYou;
        repromptOutput.speech = 'I can help with doing things such as ' +
            'creating a repo or checking latest commit. ' +
            whatCanIdoForYou;

        response.ask(speechOutput, repromptOutput);
    },
    promptHelpResponse: function(response) {
        var whatCanIdoForYou = 'What can I do for you? ';
        speechOutput.speech = 'I can help with doing things such as ' +
            'creating a repo or checking latest commit. ' +
            whatCanIdoForYou;
        repromptOutput.speech = whatCanIdoForYou;

        response.ask(speechOutput, repromptOutput);
    },
    promptStopResponse: function(response) {
        speechOutput.speech = 'Goodbye.';
        response.tell(speechOutput);
    },
    promptCreateRepositoryResponse: function(response) {
        speechOutput.speech = 'I was able to create the repo successfully. ';
        response.tell(speechOutput);
    },
    promptLatestCommitResponse: function(repositoryName, committer, message, response) {
        speechOutput.speech = 'The latest commit for ' + repositoryName + ' is ' +
            message + ' made by ' + committer + '. ';
        response.tell(speechOutput);
    },
    promptSlotsErrorResponse: function(response) {
        speechOutput.speech = 'I don\'t think I heard you quite right. Can you try again? ';
        repromptOutput.speech = 'I\'m still trying to work out the kinks. Please try again. ';
        response.ask(speechOutput, repromptOutput);
    },
    promptApiErrorResponse: function(response) {
        speechOutput.speech = 'There seems to be an issue right now. Try again later. ';
        response.tell(speechOutput);
    },
    promptRepoEmptyError: function(repositoryName, response) {
        speechOutput.speech = 'There are no commits for ' + repositoryName + '. ';
        response.tell(speechOutput);
    },
    promptRepoAlreadyExistsError: function(repositoryName, response) {
        speechOutput.speech = 'Repository ' + repositoryName + ' already exists. ';
        response.tell(speechOutput);
    },
    promptAccountReLinkResponse: function(response) {
        speechOutput.speech = 'It seems there maybe an issue with your account linking. Please relink your account and try again. ';
        response.tell(speechOutput);
    }
}
