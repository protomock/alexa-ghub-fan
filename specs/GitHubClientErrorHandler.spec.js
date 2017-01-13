var expect = require('chai').expect;
var sinon = require('sinon');

describe('GitHubClientErrorHandler.js', function() {
    var subject,
        responseMock,
        promptApiErrorResponseStub;
    beforeEach(function() {
        delete require.cache[require.resolve('../src/GitHubClientErrorHandler')];
        subject = require('../src/GitHubClientErrorHandler');
        responseMock = {};

        promptApiErrorResponseStub = sinon.stub(binder.objectGraph['PlainTextResponder'], 'promptApiErrorResponse')

    });

    afterEach(function() {
        promptApiErrorResponseStub.restore();
    })

    describe('handleLatestCommitError', function() {
        context('when the error is a 409', function() {
            var promptRepoEmptyErrorStub;
            beforeEach(function() {
                promptRepoEmptyErrorStub = sinon.stub(binder.objectGraph['PlainTextResponder'], 'promptRepoEmptyError');
                subject.handleLatestCommitError('some-repo', responseMock, 'some-error', 409);
            });

            it('should prompt the user that the repo was empty', function() {
                expect(promptRepoEmptyErrorStub.called).to.be.ok;
                expect(promptRepoEmptyErrorStub.getCall(0).args[0]).to.be.equal('some-repo');
                expect(promptRepoEmptyErrorStub.getCall(0).args[1]).to.be.equal(responseMock);
            });
        });

        context('when any other error', function() {
            beforeEach(function() {
                subject.handleLatestCommitError('some-repo', responseMock, 'some-error', 500);
            });

            it('should prompt the user that there was an error', function() {
                expect(promptApiErrorResponseStub.called).to.be.ok;
                expect(promptApiErrorResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
            });
        });
    });

    describe('handleListMyRepositoriesError', function() {
        beforeEach(function() {
            subject.handleListMyRepositoriesError(responseMock, 'some-error', 500);
        });

        it('should prompt the user that there was an error', function() {
            expect(promptApiErrorResponseStub.called).to.be.ok;
            expect(promptApiErrorResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
        });
    });

    describe('handleListAllMyOpenIssuesError', function() {
        beforeEach(function() {
            subject.handleListAllMyOpenIssuesError(responseMock, 'some-error', 500);
        });

        it('should prompt the user that there was an error', function() {
            expect(promptApiErrorResponseStub.called).to.be.ok;
            expect(promptApiErrorResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
        });
    });
    describe('handleCreateRepositoryError', function() {
        context('when the error is a 422', function() {
            var promptRepoAlreadyExistsErrorStub;
            beforeEach(function() {
                promptRepoAlreadyExistsErrorStub = sinon.stub(binder.objectGraph['PlainTextResponder'], 'promptRepoAlreadyExistsError');
                subject.handleCreateRepositoryError('some-repo', responseMock, 'some-error', 422);
            });

            it('should prompt the user that the repo already exists', function() {
                expect(promptRepoAlreadyExistsErrorStub.called).to.be.ok;
                expect(promptRepoAlreadyExistsErrorStub.getCall(0).args[0]).to.be.equal('some-repo');
                expect(promptRepoAlreadyExistsErrorStub.getCall(0).args[1]).to.be.equal(responseMock);
            });
        });

        context('when any other error', function() {
            beforeEach(function() {
                subject.handleCreateRepositoryError('some-repo', responseMock, 'some-error', 500);
            });

            it('should prompt the user that there was an error', function() {
                expect(promptApiErrorResponseStub.called).to.be.ok;
                expect(promptApiErrorResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
            });
        });
    });

    describe('handleGetMyInfoError', function() {
        beforeEach(function() {
            subject.handleGetMyInfoError(responseMock, 'some-error', 500);
        });

        it('should prompt the user that there was an error', function() {
            expect(promptApiErrorResponseStub.called).to.be.ok;
            expect(promptApiErrorResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
        });
    });

});
