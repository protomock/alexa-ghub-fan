var expect = require('chai').expect;
var sinon = require('sinon');
var mockInjector = require('mock-injector')(__dirname);
var repoHeadFactory = require('../src/RepoHeadFactory');

describe('index.js', function() {
    var subject;
    beforeEach(function() {
        createInstanceStub = sinon.stub(repoHeadFactory, 'createInstance');
        mockInjector.inject('../src/RepoHeadFactory', repoHeadFactory);
        subject = mockInjector.subject('../src/index');
    });

    afterEach(function() {
        createInstanceStub.restore();
    });

    it('should setup the handler for responding to the alexa request', function() {
        expect(typeof subject.handler).to.be.equal('function');
    });

    describe('handler', function() {
        var gitHubHelperMock,
            executeStub;

        beforeEach(function() {
            executeStub = sinon.stub();
            gitHubHelperMock = {
                execute: executeStub
            };
            createInstanceStub.returns(gitHubHelperMock);
            subject.handler('event', 'context');
        });
        it('should call get a new instance of RepoHead', function() {
            expect(createInstanceStub.called).to.be.ok;
        });
        it('should call execute with provided event and context', function() {
            expect(executeStub.called).to.be.ok;
            expect(executeStub.getCall(0).args[0]).to.be.equal('event');
            expect(executeStub.getCall(0).args[1]).to.be.equal('context');
        });
    });
});
