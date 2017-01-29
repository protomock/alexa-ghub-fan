const APP_ID = process.env.APP_ID;
var AlexaSkill = require('./AlexaSkill');

var RepoHead = function() {
    AlexaSkill.call(this, APP_ID);
}
RepoHead.prototype = Object.create(AlexaSkill.prototype);
RepoHead.prototype.constructor = RepoHead;

RepoHead.prototype.eventHandlers = require('./IntentHandlers');
RepoHead.prototype.intentHandlers = require('./EventHandlers');


module.exports = RepoHead
