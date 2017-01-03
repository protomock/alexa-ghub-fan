require('dependency-binder')({
    'RequestHandlers': require('./RequestHandlers')
});

var requestHandlers = binder.resolve('RequestHandlers');

module.exports = {
    onSessionStarted: function(sessionStartedRequest, session) {
        console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId +
            ", sessionId: " + session.sessionId);
        requestHandlers.handleSessionStarted(session);
    },
    onLaunch: function(launchRequest, session, response) {
        console.log("onLaunch requestI\d: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
        requestHandlers.handleWelcomeRequest(response);
    },
    onSessionEnded: function(sessionEndedRequest, session) {
        console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId +
            ", sessionId: " + session.sessionId);
    }
};
