const MATCHER_KEY = 'name'
const NAME_KEY = 'name'
const OWNER_KEY = 'owner'

var slotProvider = require('./SlotProvider')
var GitHubClientFactory = require('./GitHubClientFactory')
var ssmlProvider = require('./SSMLResponder')
var plainTextResponder = require('./PlainTextResponder')
var stringMatcher = require('./StringMatcher')

module.exports = {
  handleWelcomeRequest: function (session, response) {
    plainTextResponder.promptWelcomeResponse(session.attributes[NAME_KEY], response)
  },
  handleUnLinkedWelcomeRequest: function (response) {
    plainTextResponder.promptUnlinkedWelcomeResponse(response)
  },
  handleHelpRequest: function (response) {
    plainTextResponder.promptHelpResponse(response)
  },
  handleStopIntent: function (response) {
    plainTextResponder.promptStopResponse(response)
  },
  handleCreateRepositoryRequest: function (intent, session, response) {
    var slots = slotProvider.provideCreateRepositorySlots(intent)

    if (slots.error) {
      plainTextResponder.promptSlotsErrorResponse(response)
    } else {
      var client = GitHubClientFactory.createInstance(response)
      var repositoryName = slots.RepositoryName.value
      var onSuccess = function () {
        plainTextResponder.promptCreateRepositoryResponse(repositoryName, response)
      }

      client.createRepository(repositoryName, slots.Privacy.value, session.user.accessToken, onSuccess)
    }
  },
  handleListRepositoryRequest: function (session, response) {
    var client = GitHubClientFactory.createInstance(response)
    var onSuccess = function (data) {
      ssmlProvider.promptListOfRepositoriesResponse(data, response)
    }
    client.listMyRepositories(session.user.accessToken, onSuccess)
  },
  handleListAllMyOpenIssuesRequest: function (session, response) {
    var client = GitHubClientFactory.createInstance(response)
    var onSuccess = function (data) {
      ssmlProvider.promptListOfIssuesResponse(data, response)
    }
    client.listAllMyOpenIssues(session.user.accessToken, onSuccess)
  },
  handleGetLatestCommitRequest: function (intent, session, response) {
    var latestCommitSlot = slotProvider.provideLatestCommitSlots(intent)

    if (latestCommitSlot.error) {
      plainTextResponder.promptSlotsErrorResponse(response)
    } else {
      var client = GitHubClientFactory.createInstance(response)
      var onSuccess = function (data) {
        var repositoryName = stringMatcher.match(data, MATCHER_KEY, latestCommitSlot.value)
        client.getLatestCommit(repositoryName, session.attributes[OWNER_KEY], session.user.accessToken, function (commits) {
          var latestCommit = commits[0]
          plainTextResponder.promptLatestCommitResponse(repositoryName, latestCommit.commit.committer.name, latestCommit.commit.message, response)
        })
      }

      client.listMyRepositories(session.user.accessToken, onSuccess)
    }
  }
}
