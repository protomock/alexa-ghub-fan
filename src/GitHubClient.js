const PRIVATE = 'private';

require('dependency-binder')({
    'RestManager': require('./RestManager'),
});

var restManager = binder.resolve('RestManager');

module.exports = {
    createRepository: function(name, privacy, accessToken, onSuccess, onError) {
        var data = {
            name: name,
            description: 'This repository was created by Alexa!',
            private: privacy == PRIVATE ? true : false,
            has_issues: true,
            has_wiki: true,
            has_downloads: true
        };
        restManager.makeRequest('POST', '/user/repos', data, accessToken, onSuccess, onError);
    },
    listMyRepositories: function(accessToken, onSuccess, onError) {
        restManager.makeRequest('GET', '/user/repos', null, accessToken, onSuccess, onError);
    },
    listAllMyOpenIssues: function(accessToken, onSuccess, onError) {
        restManager.makeRequest('GET', '/issues', null, accessToken, onSuccess, onError);
    },
    getMyInfo: function(accessToken, onSuccess, onError) {
        restManager.makeRequest('GET', '/user', null, accessToken, onSuccess, onError);
    },
    getLatestCommit: function(name, owner, accessToken, onSuccess, onError) {
        var path = '/repos/' + owner + '/' + name + '/commits';
        restManager.makeRequest('GET', path, null, accessToken, onSuccess, onError);
    }
}
