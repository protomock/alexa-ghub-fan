const APP_ID = process.env.APP_ID;

require('dependency-binder')({
    'AlexaSkill': require('./AlexaSkill'),
    'RequestHandlers': require('./RequestHandlers'),
    'IntentHandlers': require('./IntentHandlers')
});
var AlexaSkill = binder.resolve('AlexaSkill');
var RequestHandlers = binder.resolve('RequestHandlers');

var GitHubHelper = function() {
    AlexaSkill.call(this, APP_ID);
}
GitHubHelper.prototype = Object.create(AlexaSkill.prototype);
GitHubHelper.prototype.constructor = GitHubHelper;

GitHubHelper.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

GitHubHelper.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("onLaunch requestI\d: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    RequestHandlers.handleWelcomeRequest(response);
};

GitHubHelper.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

GitHubHelper.prototype.intentHandlers = binder.resolve('IntentHandlers');


module.exports = GitHubHelper
