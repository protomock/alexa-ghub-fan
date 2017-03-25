var expect = require('chai').expect;
var sinon = require('sinon');
var mockInjector = require('mock-injector')(__dirname);

describe('GitHubClientFactory.js', function() {
    var subject,
        responseMock,
        askStub,
        tellStub,
        sessionMock,
        fakeGitHubClient;
    beforeEach(function() {
        fakeGitHubClient = function(response) {
            this.response = response;
        };
        mockInjector.inject('../src/GitHubClient', fakeGitHubClient);

        subject = mockInjector.subject('../src/GitHubClientFactory');
    });
    //TODO: Look at making test stronger
    describe('createInstance', function() {
        var actual,
            constructorStub;
        beforeEach(function() {
            actual = subject.createInstance('some-response');
        });

        it('should create an instance of GitHubClient', function() {
            expect(actual.response).to.be.equal('some-response');
        });
    });
});
