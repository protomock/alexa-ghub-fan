const APP_ID = process.env.APP_ID;

require('dependency-binder')({
    'AlexaSkill': require('./AlexaSkill'),
    'IntentHandlers': require('./IntentHandlers'),
    'EventHandlers': require('./EventHandlers')
});
var AlexaSkill = binder.resolve('AlexaSkill');

var GitHubHelper = function() {
    AlexaSkill.call(this, APP_ID);
}
GitHubHelper.prototype = Object.create(AlexaSkill.prototype);
GitHubHelper.prototype.constructor = GitHubHelper;

GitHubHelper.prototype.eventHandlers = binder.resolve('EventHandlers');
GitHubHelper.prototype.intentHandlers = binder.resolve('IntentHandlers');


module.exports = GitHubHelper
