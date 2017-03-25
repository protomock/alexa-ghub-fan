var GitHubClientErrorHandler = require('./GitHubClientErrorHandler');


module.exports = {
    createGitHubErrorHandler: function(response) {
        return new GitHubClientErrorHandler(response);
    }
}
