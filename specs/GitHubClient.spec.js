var expect = require('chai').expect;
var sinon = require('sinon');

describe('GitHubClient.js', function() {
    var subject;
    beforeEach(function() {
        subject = require('../src/GitHubClient');
        makeRequestStub = sinon.stub(binder.objectGraph['RestManager'], 'makeRequest');
    });

    afterEach(function() {
        makeRequestStub.restore();
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
                expect(makeRequestStub.getCall(0).args[5]).to.be.equal('onError');
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
                expect(makeRequestStub.getCall(0).args[5]).to.be.equal('onError');
            });
        });

    });
    describe('listMyRepositories', function() {
        var data;
        beforeEach(function() {
            subject.listMyRepositories('some-token', 'onSuccess', 'onError');
        });
        it('should call RestManager with the correct parameters', function() {
            expect(makeRequestStub.called).to.be.ok;
            expect(makeRequestStub.getCall(0).args[0]).to.be.equal('GET');
            expect(makeRequestStub.getCall(0).args[1]).to.be.equal('/user/repos');
            expect(makeRequestStub.getCall(0).args[2]).to.be.equal(null);
            expect(makeRequestStub.getCall(0).args[3]).to.be.equal('some-token');
            expect(makeRequestStub.getCall(0).args[4]).to.be.equal('onSuccess');
            expect(makeRequestStub.getCall(0).args[5]).to.be.equal('onError');
        });
    });
    describe('listAllMyOpenIssues', function() {
        var data;
        beforeEach(function() {
            subject.listAllMyOpenIssues('some-token', 'onSuccess', 'onError');
        });
        it('should call RestManager with the correct parameters', function() {
            expect(makeRequestStub.called).to.be.ok;
            expect(makeRequestStub.getCall(0).args[0]).to.be.equal('GET');
            expect(makeRequestStub.getCall(0).args[1]).to.be.equal('/issues');
            expect(makeRequestStub.getCall(0).args[2]).to.be.equal(null);
            expect(makeRequestStub.getCall(0).args[3]).to.be.equal('some-token');
            expect(makeRequestStub.getCall(0).args[4]).to.be.equal('onSuccess');
            expect(makeRequestStub.getCall(0).args[5]).to.be.equal('onError');
        });
    });
    describe('getMyInfo', function() {
        var data;
        beforeEach(function() {
            subject.getMyInfo('some-token', 'onSuccess', 'onError');
        });
        it('should call RestManager with the correct parameters', function() {
            expect(makeRequestStub.called).to.be.ok;
            expect(makeRequestStub.getCall(0).args[0]).to.be.equal('GET');
            expect(makeRequestStub.getCall(0).args[1]).to.be.equal('/user');
            expect(makeRequestStub.getCall(0).args[2]).to.be.equal(null);
            expect(makeRequestStub.getCall(0).args[3]).to.be.equal('some-token');
            expect(makeRequestStub.getCall(0).args[4]).to.be.equal('onSuccess');
            expect(makeRequestStub.getCall(0).args[5]).to.be.equal('onError');
        });
    });
    describe('getLatestCommit', function() {
        var data;
        beforeEach(function() {
            subject.getLatestCommit('some-name', 'some-owner', 'some-token', 'onSuccess', 'onError');
        });
        it('should call RestManager with the correct parameters', function() {
            expect(makeRequestStub.called).to.be.ok;
            expect(makeRequestStub.getCall(0).args[0]).to.be.equal('GET');
            expect(makeRequestStub.getCall(0).args[1]).to.be.equal('/repos/some-owner/some-name/commits');
            expect(makeRequestStub.getCall(0).args[2]).to.be.equal(null);
            expect(makeRequestStub.getCall(0).args[3]).to.be.equal('some-token');
            expect(makeRequestStub.getCall(0).args[4]).to.be.equal('onSuccess');
            expect(makeRequestStub.getCall(0).args[5]).to.be.equal('onError');
        });
    });
});
