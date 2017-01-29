var expect = require('chai').expect;
var sinon = require('sinon');
var mockInjector = require('mock-injector')(__dirname);


describe('GitHubClientFactory.js', function() {
    var subject,
        responseMock,
        askStub,
        tellStub,
        sessionMock;
    beforeEach(function() {
        subject = mockInjector.subject('../src/GitHubClientFactory');
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
