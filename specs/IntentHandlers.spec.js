var expect = require('chai').expect;
var sinon = require('sinon');

describe('IntentHandlers.js', function() {
    var subject;
    beforeEach(function() {
        subject = require('../src/IntentHandlers');
    });

    describe('ListMyRepositoriesIntent', function() {
        var handleListRepositoryRequest;
        beforeEach(function() {
            handleListRepositoryRequest = sinon.stub(binder.objectGraph['RequestHandlers'], 'handleListRepositoryRequest');

            subject['ListMyRepositoriesIntent']('intent', 'session', 'response')
        });

        it('should handle the the create repo request', function() {
            expect(handleListRepositoryRequest.called).to.be.ok;
            expect(handleListRepositoryRequest.getCall(0).args[0]).to.be.equal('session');
            expect(handleListRepositoryRequest.getCall(0).args[1]).to.be.equal('response');
        });
    });
    describe('CreateRepositoryIntent', function() {
        var handleCreateRepositoryRequest;
        beforeEach(function() {
            handleCreateRepositoryRequest = sinon.stub(binder.objectGraph['RequestHandlers'], 'handleCreateRepositoryRequest');

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
        var handleListAllMyOpenIssuesRequest;
        beforeEach(function() {
            handleListAllMyOpenIssuesRequest = sinon.stub(binder.objectGraph['RequestHandlers'], 'handleListAllMyOpenIssuesRequest');

            subject['ListAllMyOpenIssuesIntent']('intent', 'session', 'response')
        });

        it('should handle the the create repo request', function() {
            expect(handleListAllMyOpenIssuesRequest.called).to.be.ok;
            expect(handleListAllMyOpenIssuesRequest.getCall(0).args[0]).to.be.equal('session');
            expect(handleListAllMyOpenIssuesRequest.getCall(0).args[1]).to.be.equal('response');
        });
    });

    describe('GetLatestCommitIntent', function() {
        var handleGetLatestCommitRequest;
        beforeEach(function() {
            handleGetLatestCommitRequest = sinon.stub(binder.objectGraph['RequestHandlers'], 'handleGetLatestCommitRequest');
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
        var handleHelpRequestStub;
        beforeEach(function() {
            handleHelpRequestStub = sinon.stub(binder.objectGraph['RequestHandlers'], 'handleHelpRequest');
            subject['AMAZON.HelpIntent']('intent', 'session', 'response')
        });

        it('should handle the help request', function() {
            expect(handleHelpRequestStub.called).to.be.ok;
            expect(handleHelpRequestStub.getCall(0).args[0]).to.be.equal('response');
        });
    });

    describe('AMAZON.StopIntent', function() {
        var handleStopIntent;
        beforeEach(function() {
            handleStopIntent = sinon.stub(binder.objectGraph['RequestHandlers'], 'handleStopIntent');
            subject['AMAZON.StopIntent']('intent', 'session', 'response')
        });

        it('should handle the stop request', function() {
            expect(handleStopIntent.called).to.be.ok;
            expect(handleStopIntent.getCall(0).args[0]).to.be.equal('response');
        });
        afterEach(function() {
          handleStopIntent.restore();
        });
    });

    describe('AMAZON.CancelIntent', function() {
        var handleStopIntent;
        beforeEach(function() {
            handleStopIntent = sinon.stub(binder.objectGraph['RequestHandlers'], 'handleStopIntent');
            subject['AMAZON.CancelIntent']('intent', 'session', 'response')
        });

        it('should handle the stop request', function() {
            expect(handleStopIntent.called).to.be.ok;
            expect(handleStopIntent.getCall(0).args[0]).to.be.equal('response');
        });
        afterEach(function() {
          handleStopIntent.restore();
        });
    });
});
