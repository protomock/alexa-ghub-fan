var expect = require('chai').expect;
var sinon = require('sinon');
var mockInjector = require('mock-injector')(__dirname);
var restManager = require('../src/RestManager');
var gitHubClientErrorHandler = require('../src/GitHubClientErrorHandler');

describe('GitHubClient.js', function() {
    var subject,
        responseMock,
        makeRequestStub,
        handleCreateRepositoryErrorStub,
        handleListMyRepositoriesErrorStub,
        handleListAllMyOpenIssuesErrorStub,
        handleGetMyInfoErrorStub,
        handleLatestCommitErrorStub;

    beforeEach(function() {
        makeRequestStub = sinon.stub(restManager, 'makeRequest');
        mockInjector.inject('../src/RestManager', restManager);

        handleCreateRepositoryErrorStub = sinon.stub(gitHubClientErrorHandler, 'handleCreateRepositoryError');
        handleListMyRepositoriesErrorStub = sinon.stub(gitHubClientErrorHandler, 'handleListMyRepositoriesError');
        handleListAllMyOpenIssuesErrorStub = sinon.stub(gitHubClientErrorHandler, 'handleListAllMyOpenIssuesError');
        handleGetMyInfoErrorStub = sinon.stub(gitHubClientErrorHandler, 'handleGetMyInfoError');
        handleLatestCommitErrorStub = sinon.stub(gitHubClientErrorHandler, 'handleLatestCommitError');
        mockInjector.inject('../src/GitHubClientErrorHandler', gitHubClientErrorHandler);

        responseMock = {};
        GitHubClient = mockInjector.subject('../src/GitHubClient');
        subject = new GitHubClient(responseMock);
    });

    afterEach(function() {
        makeRequestStub.restore();
        handleCreateRepositoryErrorStub.restore();
        handleListMyRepositoriesErrorStub.restore();
        handleListAllMyOpenIssuesErrorStub.restore();
        handleGetMyInfoErrorStub.restore();
        handleLatestCommitErrorStub.restore();
    });

    describe('createRepository', function() {
        var data;
        context('when request has for a public repo', function() {
            beforeEach(function() {
                data = {
                    name: 'some-name',
                    description: 'This repository was created by Alexa!',
                    private: false,
                    has_issues: true,
                    has_wiki: true,
                    has_downloads: true
                }
                subject.createRepository(data.name, 'public', 'some-token', 'onSuccess', 'onError');
            });
            it('should call RestManager with the correct parameters', function() {
                expect(makeRequestStub.called).to.be.ok;
                expect(makeRequestStub.getCall(0).args[0]).to.be.equal('POST');
                expect(makeRequestStub.getCall(0).args[1]).to.be.equal('/user/repos');
                expect(makeRequestStub.getCall(0).args[2].name).to.be.equal(data.name);
                expect(makeRequestStub.getCall(0).args[2].description).to.be.equal(data.description);
                expect(makeRequestStub.getCall(0).args[2].private).to.be.equal(false);
                expect(makeRequestStub.getCall(0).args[2].has_issues).to.be.equal(data.has_issues);
                expect(makeRequestStub.getCall(0).args[2].has_wiki).to.be.equal(data.has_wiki);
                expect(makeRequestStub.getCall(0).args[2].has_downloads).to.be.equal(data.has_downloads);
                expect(makeRequestStub.getCall(0).args[3]).to.be.equal('some-token');
                expect(makeRequestStub.getCall(0).args[4]).to.be.equal('onSuccess');
                expect(typeof makeRequestStub.getCall(0).args[5]).to.be.equal('function');
            });
        });
        context('when request has for a private repo', function() {
            beforeEach(function() {
                data = {
                    name: 'some-name',
                    description: 'This repository was created by Alexa!',
                    private: false,
                    has_issues: true,
                    has_wiki: true,
                    has_downloads: true
                }
                subject.createRepository(data.name, 'private', 'some-token', 'onSuccess', 'onError');
            });
            it('should call RestManager with the correct parameters', function() {
                expect(makeRequestStub.called).to.be.ok;
                expect(makeRequestStub.getCall(0).args[0]).to.be.equal('POST');
                expect(makeRequestStub.getCall(0).args[1]).to.be.equal('/user/repos');
                expect(makeRequestStub.getCall(0).args[2].name).to.be.equal(data.name);
                expect(makeRequestStub.getCall(0).args[2].description).to.be.equal(data.description);
                expect(makeRequestStub.getCall(0).args[2].private).to.be.equal(true);
                expect(makeRequestStub.getCall(0).args[2].has_issues).to.be.equal(data.has_issues);
                expect(makeRequestStub.getCall(0).args[2].has_wiki).to.be.equal(data.has_wiki);
                expect(makeRequestStub.getCall(0).args[2].has_downloads).to.be.equal(data.has_downloads);
                expect(makeRequestStub.getCall(0).args[3]).to.be.equal('some-token');
                expect(makeRequestStub.getCall(0).args[4]).to.be.equal('onSuccess');
                expect(typeof makeRequestStub.getCall(0).args[5]).to.be.equal('function');
            });
        });

        describe('onError', function() {
            beforeEach(function() {
                subject.createRepository('some-name', 'private', 'some-token', 'onSuccess', 'onError');
                makeRequestStub.getCall(0).args[5]('some-error', 'some-status');
            });

            it('should call the error handler with the correct parameters', function() {
                expect(handleCreateRepositoryErrorStub.called).to.be.ok;
                expect(handleCreateRepositoryErrorStub.getCall(0).args[0]).to.be.equal('some-name');
                expect(handleCreateRepositoryErrorStub.getCall(0).args[1]).to.be.equal(responseMock);
                expect(handleCreateRepositoryErrorStub.getCall(0).args[2]).to.be.equal('some-error');
                expect(handleCreateRepositoryErrorStub.getCall(0).args[3]).to.be.equal('some-status');
            });
        });

    });
    describe('listMyRepositories', function() {
        var data;
        beforeEach(function() {
            subject.listMyRepositories('some-token', 'onSuccess');
        });
        it('should call RestManager with the correct parameters', function() {
            expect(makeRequestStub.called).to.be.ok;
            expect(makeRequestStub.getCall(0).args[0]).to.be.equal('GET');
            expect(makeRequestStub.getCall(0).args[1]).to.be.equal('/user/repos');
            expect(makeRequestStub.getCall(0).args[2]).to.be.equal(null);
            expect(makeRequestStub.getCall(0).args[3]).to.be.equal('some-token');
            expect(makeRequestStub.getCall(0).args[4]).to.be.equal('onSuccess');
            expect(typeof makeRequestStub.getCall(0).args[5]).to.be.equal('function');
        });

        describe('onError', function() {
            beforeEach(function() {
                makeRequestStub.getCall(0).args[5]('some-error', 'some-status');
            });

            it('should call the error handler with the correct parameters', function() {
                expect(handleListMyRepositoriesErrorStub.called).to.be.ok;
                expect(handleListMyRepositoriesErrorStub.getCall(0).args[0]).to.be.equal(responseMock);
                expect(handleListMyRepositoriesErrorStub.getCall(0).args[1]).to.be.equal('some-error');
                expect(handleListMyRepositoriesErrorStub.getCall(0).args[2]).to.be.equal('some-status');
            });
        });
    });
    describe('listAllMyOpenIssues', function() {
        var data;
        beforeEach(function() {
            subject.listAllMyOpenIssues('some-token', 'onSuccess');
        });
        it('should call RestManager with the correct parameters', function() {
            expect(makeRequestStub.called).to.be.ok;
            expect(makeRequestStub.getCall(0).args[0]).to.be.equal('GET');
            expect(makeRequestStub.getCall(0).args[1]).to.be.equal('/issues');
            expect(makeRequestStub.getCall(0).args[2]).to.be.equal(null);
            expect(makeRequestStub.getCall(0).args[3]).to.be.equal('some-token');
            expect(makeRequestStub.getCall(0).args[4]).to.be.equal('onSuccess');
            expect(typeof makeRequestStub.getCall(0).args[5]).to.be.equal('function');
        });

        describe('onError', function() {
            beforeEach(function() {
                makeRequestStub.getCall(0).args[5]('some-error', 'some-status');
            });

            it('should call the error handler with the correct parameters', function() {
                expect(handleListAllMyOpenIssuesErrorStub.called).to.be.ok;
                expect(handleListAllMyOpenIssuesErrorStub.getCall(0).args[0]).to.be.equal(responseMock);
                expect(handleListAllMyOpenIssuesErrorStub.getCall(0).args[1]).to.be.equal('some-error');
                expect(handleListAllMyOpenIssuesErrorStub.getCall(0).args[2]).to.be.equal('some-status');
            });
        });
    });
    describe('getMyInfo', function() {
        var data;
        beforeEach(function() {
            subject.getMyInfo('some-token', 'onSuccess');
        });
        it('should call RestManager with the correct parameters', function() {
            expect(makeRequestStub.called).to.be.ok;
            expect(makeRequestStub.getCall(0).args[0]).to.be.equal('GET');
            expect(makeRequestStub.getCall(0).args[1]).to.be.equal('/user');
            expect(makeRequestStub.getCall(0).args[2]).to.be.equal(null);
            expect(makeRequestStub.getCall(0).args[3]).to.be.equal('some-token');
            expect(makeRequestStub.getCall(0).args[4]).to.be.equal('onSuccess');
            expect(typeof makeRequestStub.getCall(0).args[5]).to.be.equal('function');
        });
        describe('onError', function() {
            beforeEach(function() {
                makeRequestStub.getCall(0).args[5]('some-error', 'some-status');
            });

            it('should call the error handler with the correct parameters', function() {
                expect(handleGetMyInfoErrorStub.called).to.be.ok;
                expect(handleGetMyInfoErrorStub.getCall(0).args[0]).to.be.equal(responseMock);
                expect(handleGetMyInfoErrorStub.getCall(0).args[1]).to.be.equal('some-error');
                expect(handleGetMyInfoErrorStub.getCall(0).args[2]).to.be.equal('some-status');
            });
        });
    });
    describe('getLatestCommit', function() {
        var data;
        beforeEach(function() {
            subject.getLatestCommit('some-name', 'some-owner', 'some-token', 'onSuccess');
        });
        it('should call RestManager with the correct parameters', function() {
            expect(makeRequestStub.called).to.be.ok;
            expect(makeRequestStub.getCall(0).args[0]).to.be.equal('GET');
            expect(makeRequestStub.getCall(0).args[1]).to.be.equal('/repos/some-owner/some-name/commits');
            expect(makeRequestStub.getCall(0).args[2]).to.be.equal(null);
            expect(makeRequestStub.getCall(0).args[3]).to.be.equal('some-token');
            expect(makeRequestStub.getCall(0).args[4]).to.be.equal('onSuccess');
            expect(typeof makeRequestStub.getCall(0).args[5]).to.be.equal('function');
        });

        describe('onError', function() {
            beforeEach(function() {
                makeRequestStub.getCall(0).args[5]('some-error', 'some-status');
            });

            it('should call the error handler with the correct parameters', function() {
                expect(handleLatestCommitErrorStub.called).to.be.ok;
                expect(handleLatestCommitErrorStub.getCall(0).args[0]).to.be.equal('some-name');
                expect(handleLatestCommitErrorStub.getCall(0).args[1]).to.be.equal(responseMock);
                expect(handleLatestCommitErrorStub.getCall(0).args[2]).to.be.equal('some-error');
                expect(handleLatestCommitErrorStub.getCall(0).args[3]).to.be.equal('some-status');
            });
        });
    });
});
