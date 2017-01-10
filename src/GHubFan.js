const APP_ID = process.env.APP_ID;

require('dependency-binder')({
    'AlexaSkill': require('./AlexaSkill'),
    'IntentHandlers': require('./IntentHandlers'),
    'EventHandlers': require('./EventHandlers')
});
var AlexaSkill = binder.resolve('AlexaSkill');

var GHubFan = function() {
    AlexaSkill.call(this, APP_ID);
}
GHubFan.prototype = Object.create(AlexaSkill.prototype);
GHubFan.prototype.constructor = GHubFan;

GHubFan.prototype.eventHandlers = binder.resolve('EventHandlers');
GHubFan.prototype.intentHandlers = binder.resolve('IntentHandlers');


module.exports = GHubFan
