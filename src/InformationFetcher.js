const OWNER_KEY = 'owner';

require('dependency-binder')({
    'GitHubClientFactory': require('./GitHubClientFactory')
});

var GitHubClientFactory = binder.resolve('GitHubClientFactory');

module.exports = {
    getUserInformation: function(session, response, success) {
        var client = GitHubClientFactory.createInstance(response);
        var onSuccess = function(data) {
            session.attributes[OWNER_KEY] = data.login;
            success(session);
        };

        client.getMyInfo(session.user.accessToken, onSuccess);
    }
}
