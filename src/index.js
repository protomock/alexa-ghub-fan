require('dependency-binder')({
    'GitVoiceFactory': require('./GitVoiceFactory')
});

module.exports.handler = function(event, context) {
    var GitVoiceFactory = binder.resolve('GitVoiceFactory');
    var GitVoice = GitVoiceFactory.createInstance();
    GitVoice.execute(event, context);
};
