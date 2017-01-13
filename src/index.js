require('dependency-binder')({
    'RepoHeadFactory': require('./RepoHeadFactory')
});

module.exports.handler = function(event, context) {
    var RepoHeadFactory = binder.resolve('RepoHeadFactory');
    var RepoHead = RepoHeadFactory.createInstance();
    RepoHead.execute(event, context);
};
