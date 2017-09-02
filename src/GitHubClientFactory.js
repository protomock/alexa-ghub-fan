module.exports = {
  createInstance: function (response) {
    var GitHubClient = require('./GitHubClient')
    return new GitHubClient(response)
  }
}
