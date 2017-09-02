const APP_ID = process.env.APP_ID
var AlexaSkill = require('./AlexaSkill')

var RepoHead = function () {
  AlexaSkill.call(this, APP_ID)
}
RepoHead.prototype = Object.create(AlexaSkill.prototype)
RepoHead.prototype.constructor = RepoHead

RepoHead.prototype.eventHandlers = require('./EventHandlers')
RepoHead.prototype.intentHandlers = require('./IntentHandlers')

module.exports = RepoHead
