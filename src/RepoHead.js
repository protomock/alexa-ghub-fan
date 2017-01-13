const APP_ID = process.env.APP_ID;

require('dependency-binder')({
    'AlexaSkill': require('./AlexaSkill'),
    'IntentHandlers': require('./IntentHandlers'),
    'EventHandlers': require('./EventHandlers')
});
var AlexaSkill = binder.resolve('AlexaSkill');

var RepoHead = function() {
    AlexaSkill.call(this, APP_ID);
}
RepoHead.prototype = Object.create(AlexaSkill.prototype);
RepoHead.prototype.constructor = RepoHead;

RepoHead.prototype.eventHandlers = binder.resolve('EventHandlers');
RepoHead.prototype.intentHandlers = binder.resolve('IntentHandlers');


module.exports = RepoHead
