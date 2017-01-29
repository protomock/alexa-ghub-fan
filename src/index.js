module.exports.handler = function(event, context) {
    var RepoHeadFactory = require('./RepoHeadFactory');
    var RepoHead = RepoHeadFactory.createInstance();
    RepoHead.execute(event, context);
};
