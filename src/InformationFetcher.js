const OWNER_KEY = 'owner';
const NAME_KEY = 'name';

require('dependency-binder')({
    'GitHubClientFactory': require('./GitHubClientFactory')
});

var GitHubClientFactory = binder.resolve('GitHubClientFactory');

module.exports = {
    getUserInformation: function(session, response, success) {
        var client = GitHubClientFactory.createInstance(response);
        var onSuccess = function(data) {
            session.attributes[OWNER_KEY] = data.login;
            session.attributes[NAME_KEY] = data.name ? data.name.split(" ")[0] : null;
            success(session);
        };

        client.getMyInfo(session.user.accessToken, onSuccess);
    }
}
