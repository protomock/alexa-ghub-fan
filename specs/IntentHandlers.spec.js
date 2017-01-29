var expect = require('chai').expect;
var sinon = require('sinon');
var mockInjector = require('mock-injector')(__dirname);
var requestHandlers = require('../src/RequestHandlers');

describe('IntentHandlers.js', function() {
    var subject,
        handleListRepositoryRequest,
        handleCreateRepositoryRequest,
        handleListAllMyOpenIssuesRequest,
        handleGetLatestCommitRequest,
        handleHelpRequestStub,
        handleStopIntent;
    before(function() {
        handleListRepositoryRequest = sinon.stub(requestHandlers, 'handleListRepositoryRequest');
        handleCreateRepositoryRequest = sinon.stub(requestHandlers, 'handleCreateRepositoryRequest');
        handleListAllMyOpenIssuesRequest = sinon.stub(requestHandlers, 'handleListAllMyOpenIssuesRequest');
        handleGetLatestCommitRequest = sinon.stub(requestHandlers, 'handleGetLatestCommitRequest');
        handleHelpRequestStub = sinon.stub(requestHandlers, 'handleHelpRequest');
        handleStopIntent = sinon.stub(requestHandlers, 'handleStopIntent');

        mockInjector.inject('../src/RequestHandlers', requestHandlers);
        subject = mockInjector.subject('../src/IntentHandlers');
    });

    describe('ListMyRepositoriesIntent', function() {
        beforeEach(function() {
            subject['ListMyRepositoriesIntent']('intent', 'session', 'response')
        });

        it('should handle the the create repo request', function() {
            expect(handleListRepositoryRequest.called).to.be.ok;
            expect(handleListRepositoryRequest.getCall(0).args[0]).to.be.equal('session');
            expect(handleListRepositoryRequest.getCall(0).args[1]).to.be.equal('response');
        });
    });
    describe('CreateRepositoryIntent', function() {
        beforeEach(function() {
            subject['CreateRepositoryIntent']('intent', 'session', 'response')
        });

        it('should handle the the create repo request', function() {
            expect(handleCreateRepositoryRequest.called).to.be.ok;
            expect(handleCreateRepositoryRequest.getCall(0).args[0]).to.be.equal('intent');
            expect(handleCreateRepositoryRequest.getCall(0).args[1]).to.be.equal('session');
            expect(handleCreateRepositoryRequest.getCall(0).args[2]).to.be.equal('response');
        });
    });

    describe('ListAllMyOpenIssuesIntent', function() {
        beforeEach(function() {
            subject['ListAllMyOpenIssuesIntent']('intent', 'session', 'response')
        });

        it('should handle the the create repo request', function() {
            expect(handleListAllMyOpenIssuesRequest.called).to.be.ok;
            expect(handleListAllMyOpenIssuesRequest.getCall(0).args[0]).to.be.equal('session');
            expect(handleListAllMyOpenIssuesRequest.getCall(0).args[1]).to.be.equal('response');
        });
    });

    describe('GetLatestCommitIntent', function() {
        beforeEach(function() {
            subject['GetLatestCommitIntent']('intent', 'session', 'response')
        });

        it('should handle the the create repo request', function() {
            expect(handleGetLatestCommitRequest.called).to.be.ok;
            expect(handleGetLatestCommitRequest.getCall(0).args[0]).to.be.equal('intent');
            expect(handleGetLatestCommitRequest.getCall(0).args[1]).to.be.equal('session');
            expect(handleGetLatestCommitRequest.getCall(0).args[2]).to.be.equal('response');
        });
    });

    describe('AMAZON.HelpIntent', function() {
        beforeEach(function() {
            subject['AMAZON.HelpIntent']('intent', 'session', 'response')
        });

        it('should handle the help request', function() {
            expect(handleHelpRequestStub.called).to.be.ok;
            expect(handleHelpRequestStub.getCall(0).args[0]).to.be.equal('response');
        });
    });

    describe('AMAZON.StopIntent', function() {
        beforeEach(function() {
            subject['AMAZON.StopIntent']('intent', 'session', 'response')
        });

        it('should handle the stop request', function() {
            expect(handleStopIntent.called).to.be.ok;
            expect(handleStopIntent.getCall(0).args[0]).to.be.equal('response');
        });
    });

    describe('AMAZON.CancelIntent', function() {
        beforeEach(function() {
            subject['AMAZON.CancelIntent']('intent', 'session', 'response')
        });

        it('should handle the stop request', function() {
            expect(handleStopIntent.called).to.be.ok;
            expect(handleStopIntent.getCall(0).args[0]).to.be.equal('response');
        });
    });
});
