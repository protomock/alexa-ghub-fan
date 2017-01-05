const APP_ID = process.env.APP_ID;

require('dependency-binder')({
    'AlexaSkill': require('./AlexaSkill'),
    'IntentHandlers': require('./IntentHandlers'),
    'EventHandlers': require('./EventHandlers')
});
var AlexaSkill = binder.resolve('AlexaSkill');

var GitVoice = function() {
    AlexaSkill.call(this, APP_ID);
}
GitVoice.prototype = Object.create(AlexaSkill.prototype);
GitVoice.prototype.constructor = GitVoice;

GitVoice.prototype.eventHandlers = binder.resolve('EventHandlers');
GitVoice.prototype.intentHandlers = binder.resolve('IntentHandlers');


module.exports = GitVoice
