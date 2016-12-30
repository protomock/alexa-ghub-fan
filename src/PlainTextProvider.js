require('dependency-binder')({
    'AlexaSkill': require('./AlexaSkill'),
});
var AlexaSkill = binder.resolve('AlexaSkill');
var speechOutput = {
    speech: '',
    type: AlexaSkill.speechOutputType.PLAIN_TEXT
};

module.exports = {
    provideCreateRepositoryText: function() {
        speechOutput.speech = 'I was able to create the repo successfully.';
        return speechOutput;
    },
    provideLatestCommitText: function(repositoryName ,committer, message, owner) {
        var speech = 'The latest commit for '+ repositoryName + ' is ' + message;
        if (owner == committer) {
            speech += ' made by you.';
        } else {
            speech += ' made by ' + committer + '.';
        }
        speechOutput.speech = speech;
        return speechOutput;
    },
    provideSlotsError: function() {
        speechOutput.speech = 'I don\'t think I heard you quite right. Can you try again?';
        return speechOutput;
    },
    provideApiError: function() {
        speechOutput.speech = 'There seems to be an issue right now. Try again later.';
        return speechOutput;
    }
}
