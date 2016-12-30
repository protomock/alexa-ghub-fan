require('dependency-binder')({
    'GitHubHelperFactory': require('./GitHubHelperFactory')
});

module.exports.handler = function(event, context) {
    var GitHubHelperFactory = binder.resolve('GitHubHelperFactory');
    var GitHubHelper = GitHubHelperFactory.createInstance();
    GitHubHelper.execute(event, context);
};
