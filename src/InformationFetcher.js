const OWNER_KEY = 'owner';

require('dependency-binder')({
    'GitHubClient': require('./GitHubClient')
});

var client = binder.resolve('GitHubClient');

module.exports = {
    getUserInformation: function(session, success, error) {
        var onSuccess = function(data) {
            session.attributes[OWNER_KEY] = data.login;
            success(session);
        };

        client.getMyInfo(session.user.accessToken, onSuccess, error);
    }
}
