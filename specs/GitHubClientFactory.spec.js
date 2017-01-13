var expect = require('chai').expect;
var sinon = require('sinon');


describe('GitHubClientFactory.js', function() {
    var subject,
        responseMock,
        askStub,
        tellStub,
        sessionMock;
    beforeEach(function() {
        delete require.cache[require.resolve('../src/GitHubClientFactory')];
        subject = require('../src/GitHubClientFactory');
    });
    //TODO: Look at making test stronger
    describe('createInstance', function() {
        var responseMock,
            actual,
            constructorStub;
        beforeEach(function() {
            responseMock = {};
            actual = subject.createInstance(responseMock);
        });

        it('should create an instance of GitHubClient', function() {
            expect(actual.response).to.be.equal(responseMock);
        });
    });
});
