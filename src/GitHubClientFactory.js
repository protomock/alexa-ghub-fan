require('dependency-binder')({
    'GitHubClient': require('./GitHubClient'),
});

module.exports = {
  createInstance: function(response) {
      var GitHubClient = binder.resolve('GitHubClient');
      return new GitHubClient(response);
  }
}
