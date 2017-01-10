require('dependency-binder')({
    'GHubFanFactory': require('./GHubFanFactory')
});

module.exports.handler = function(event, context) {
    var GHubFanFactory = binder.resolve('GHubFanFactory');
    var GHubFan = GHubFanFactory.createInstance();
    GHubFan.execute(event, context);
};
