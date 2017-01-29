var expect = require('chai').expect;
var sinon = require('sinon');
var mockInjector = require('mock-injector')(__dirname);
var SSMLResponder = require('../src/SSMLResponder');
var slotProvider = require('../src/SlotProvider');
var GitHubClientFactory = require('../src/GitHubClientFactory');
var plainTextResponder = require('../src/PlainTextResponder');
var stringMatcher = require('../src/StringMatcher');


describe('RequestHandlers.js', function() {
    var subject,
        responseMock,
        askStub,
        tellStub,
        sessionMock,
        promptUnlinkedWelcomeResponseStub,
        promptWelcomeResponseStub,
        promptHelpResponseStub,
        promptStopResponseStub,
        createInstanceStub,
        promptCreateRepositoryResponseStub,
        provideCreateRepositorySlotsStub,
        promptSlotsErrorResponseStub,
        promptListOfRepositoriesResponseStub,
        promptListOfIssuesResponseStub,
        provideLatestCommitSlotsStub,
        matchStub,
        promptLatestCommitResponseStub,
        promptSlotsErrorResponseStub;

    before(function() {
        promptUnlinkedWelcomeResponseStub = sinon.stub(plainTextResponder, 'promptUnlinkedWelcomeResponse');
        promptWelcomeResponseStub = sinon.stub(plainTextResponder, 'promptWelcomeResponse');
        promptHelpResponseStub = sinon.stub(plainTextResponder, 'promptHelpResponse');
        promptStopResponseStub = sinon.stub(plainTextResponder, 'promptStopResponse');
        createInstanceStub = sinon.stub(GitHubClientFactory, 'createInstance');
        promptCreateRepositoryResponseStub = sinon.stub(plainTextResponder, 'promptCreateRepositoryResponse');
        provideCreateRepositorySlotsStub = sinon.stub(slotProvider, 'provideCreateRepositorySlots');
        promptSlotsErrorResponseStub = sinon.stub(plainTextResponder, 'promptSlotsErrorResponse');
        promptListOfRepositoriesResponseStub = sinon.stub(SSMLResponder, 'promptListOfRepositoriesResponse');
        promptListOfIssuesResponseStub = sinon.stub(SSMLResponder, 'promptListOfIssuesResponse');
        provideLatestCommitSlotsStub = sinon.stub(slotProvider, 'provideLatestCommitSlots');
        matchStub = sinon.stub(stringMatcher, 'match');
        promptLatestCommitResponseStub = sinon.stub(plainTextResponder, 'promptLatestCommitResponse');

        mockInjector.inject('../src/SlotProvider', slotProvider);
        mockInjector.inject('../src/GitHubClientFactory', GitHubClientFactory);
        mockInjector.inject('../src/SSMLResponder', SSMLResponder);
        mockInjector.inject('../src/PlainTextResponder', plainTextResponder);
        mockInjector.inject('../src/StringMatcher', stringMatcher);
        subject = mockInjector.subject('../src/RequestHandlers');
    });

    beforeEach(function() {
        askStub = sinon.stub();
        tellStub = sinon.stub();
        responseMock = {
            ask: askStub,
            tell: tellStub
        };
        sessionMock = {
            user: {
                accessToken: "some-token"
            },
            attributes: {}
        };
    });

    describe('handleUnLinkedWelcomeRequest', function() {
        beforeEach(function() {
            subject.handleUnLinkedWelcomeRequest(responseMock);
        });

        it('should call plainTextResponder with the correct parameters', function() {
            expect(promptUnlinkedWelcomeResponseStub.called).to.be.ok;
            expect(promptUnlinkedWelcomeResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
        });
    });

    describe('handleWelcomeRequest', function() {
        beforeEach(function() {
            sessionMock.attributes['name'] = 'some-name';
            subject.handleWelcomeRequest(sessionMock, responseMock);
        });
        it('should prompt the user as expected', function() {
            expect(promptWelcomeResponseStub.called).to.be.ok;
            expect(promptWelcomeResponseStub.getCall(0).args[0]).to.be.equal('some-name');
            expect(promptWelcomeResponseStub.getCall(0).args[1]).to.be.equal(responseMock);
        });
    });

    describe('handleHelpRequest', function() {
        beforeEach(function() {
            subject.handleHelpRequest(responseMock);
        });
        it('should prompt the user as expected', function() {
            expect(promptHelpResponseStub.called).to.be.ok;
            expect(promptHelpResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
        });

    });

    describe('handleStopIntent', function() {
        beforeEach(function() {
            subject.handleStopIntent(responseMock);
        });
        it('should prompt the user as expected', function() {
            expect(promptStopResponseStub.called).to.be.ok;
            expect(promptStopResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
        });
    });
    describe('handleCreateRepositoryRequest', function() {
        var speechOutput;
        beforeEach(function() {
            createRepositoryStub = sinon.stub();

            gitHubClientMock = {
                createRepository: createRepositoryStub,
            };

            createInstanceStub.returns(gitHubClientMock);
        });
        context('when slot provider returns valid slots', function() {
            beforeEach(function() {
                provideCreateRepositorySlotsStub.returns({
                    RepositoryName: {
                        value: 'some-name'
                    },
                    Privacy: {
                        value: 'some-privacy'
                    }
                });
                subject.handleCreateRepositoryRequest('intent', sessionMock, responseMock);
            });

            it('should call the slot provider', function() {
                expect(provideCreateRepositorySlotsStub.called).to.be.ok;
                expect(provideCreateRepositorySlotsStub.getCall(0).args[0]).to.be.equal('intent');
            });
            it('should call the GitHubClient with the expected values', function() {
                expect(createRepositoryStub.called).to.be.ok;
                expect(createRepositoryStub.getCall(0).args[0]).to.be.equal('some-name');
                expect(createRepositoryStub.getCall(0).args[1]).to.be.equal('some-privacy');
                expect(createRepositoryStub.getCall(0).args[2]).to.be.equal('some-token');
                expect(typeof createRepositoryStub.getCall(0).args[3]).to.be.equal('function');
            });

            describe('onSuccess', function() {
                beforeEach(function() {
                    createRepositoryStub.getCall(0).args[3]();
                });

                it('should tell the user the request was successful', function() {
                    expect(promptCreateRepositoryResponseStub.called).to.be.ok;
                    expect(promptCreateRepositoryResponseStub.getCall(0).args[0]).to.be.equal('some-name');
                    expect(promptCreateRepositoryResponseStub.getCall(0).args[1]).to.be.equal(responseMock);
                });

            });
        });
        context('when slots provider returns invalid slots', function() {
            beforeEach(function() {
                provideCreateRepositorySlotsStub.returns({
                    error: true
                });

                subject.handleCreateRepositoryRequest('intent', sessionMock, responseMock);
            });

            it('should call the slot provider', function() {
                expect(provideCreateRepositorySlotsStub.called).to.be.ok;
                expect(provideCreateRepositorySlotsStub.getCall(1).args[0]).to.be.equal('intent');
            });
            it('should tell the user that alexa could not understand', function() {
                expect(promptSlotsErrorResponseStub.called).to.be.ok;
                expect(promptSlotsErrorResponseStub.getCall(1).args[0]).to.be.equal(responseMock);
            });

        });
    });
    describe('handleListRepositoryRequest', function() {
        beforeEach(function() {
            listMyRepositoriesStub = sinon.stub();

            gitHubClientMock = {
                listMyRepositories: listMyRepositoriesStub,
            };
            createInstanceStub.returns(gitHubClientMock);

            subject.handleListRepositoryRequest(sessionMock, responseMock);
        });

        it('should call the GitHubClient with the expected values', function() {
            expect(listMyRepositoriesStub.called).to.be.ok;
            expect(listMyRepositoriesStub.getCall(0).args[0]).to.be.equal('some-token');
            expect(typeof listMyRepositoriesStub.getCall(0).args[1]).to.be.equal('function');
        });

        describe('onSuccess', function() {
            beforeEach(function() {
                speechOutput = {
                    speech: "some-ssml",
                    type: "SSML"
                };
                listMyRepositoriesStub.getCall(0).args[1]('some-list');
            });

            it('should tell the user the request was successful', function() {
                expect(promptListOfRepositoriesResponseStub.called).to.be.ok;
                expect(promptListOfRepositoriesResponseStub.getCall(0).args[0]).to.be.equal('some-list');
                expect(promptListOfRepositoriesResponseStub.getCall(0).args[1]).to.be.equal(responseMock);
            });
        });
    });
    describe('handleListAllMyOpenIssuesRequest', function() {
        beforeEach(function() {
            listAllMyOpenIssuesStub = sinon.stub();

            gitHubClientMock = {
                listAllMyOpenIssues: listAllMyOpenIssuesStub,
            };
            createInstanceStub.returns(gitHubClientMock);

            subject.handleListAllMyOpenIssuesRequest(sessionMock, responseMock);
        });

        it('should call the GitHubClient with the expected values', function() {
            expect(listAllMyOpenIssuesStub.called).to.be.ok;
            expect(listAllMyOpenIssuesStub.getCall(0).args[0]).to.be.equal('some-token');
            expect(typeof listAllMyOpenIssuesStub.getCall(0).args[1]).to.be.equal('function');
        });

        describe('onSuccess', function() {
            beforeEach(function() {
                listAllMyOpenIssuesStub.getCall(0).args[1]('some-list');
            });

            it('should tell the user the request was successful', function() {
                expect(promptListOfIssuesResponseStub.called).to.be.ok;
                expect(promptListOfIssuesResponseStub.getCall(0).args[0]).to.be.equal('some-list');
                expect(promptListOfIssuesResponseStub.getCall(0).args[1]).to.be.equal(responseMock);
            });
        });
    });
    describe('handleGetLatestCommitRequest', function() {
        context('when slots are valid', function() {
            var gitHubClientMock;
            beforeEach(function() {
                listMyRepositoriesStub = sinon.stub();
                getLatestCommitStub = sinon.stub();

                gitHubClientMock = {
                    listMyRepositories: listMyRepositoriesStub,
                    getLatestCommit: getLatestCommitStub
                };
                createInstanceStub.returns(gitHubClientMock);
                provideLatestCommitSlotsStub.returns({
                    value: 'some-name'
                });
                subject.handleGetLatestCommitRequest('intent', sessionMock, responseMock);
            });

            it('should call the slot provider', function() {
                expect(provideLatestCommitSlotsStub.called).to.be.ok;
                expect(provideLatestCommitSlotsStub.getCall(0).args[0]).to.be.equal('intent');
            });

            it('should call the GitHubClient with the expected values', function() {
                expect(listMyRepositoriesStub.called).to.be.ok;
                expect(listMyRepositoriesStub.getCall(0).args[0]).to.be.equal('some-token');
                expect(typeof listMyRepositoriesStub.getCall(0).args[1]).to.be.equal('function');
            });

            describe('onSuccess', function() {
                var output;
                beforeEach(function() {
                    matchStub.returns('some-match');

                    sessionMock.attributes['owner'] = 'some-owner';
                    listMyRepositoriesStub.getCall(0).args[1]('some-data');
                });

                it('should call match to find the repo name', function() {
                    expect(matchStub.called).to.be.ok;
                    expect(matchStub.getCall(0).args[0]).to.be.equal('some-data');
                    expect(matchStub.getCall(0).args[1]).to.be.equal('name');
                    expect(matchStub.getCall(0).args[2]).to.be.equal('some-name');
                });

                it('should call the GitHubClient with the expected values', function() {
                    expect(getLatestCommitStub.called).to.be.ok;
                    expect(getLatestCommitStub.getCall(0).args[0]).to.be.equal('some-match');
                    expect(getLatestCommitStub.getCall(0).args[1]).to.be.equal('some-owner');
                    expect(getLatestCommitStub.getCall(0).args[2]).to.be.equal('some-token');
                    expect(typeof getLatestCommitStub.getCall(0).args[3]).to.be.equal('function');
                });

                describe('getLatestCommit - onSuccess', function() {
                    var output;
                    beforeEach(function() {
                        output = [{
                            "commit": {
                                "committer": {
                                    "name": "some-committer",
                                },
                                "message": "some-message"
                            }
                        }];
                        getLatestCommitStub.getCall(0).args[3](output);
                    });

                    it('should call plainTextProvider', function() {
                        expect(promptLatestCommitResponseStub.called).to.be.ok;
                        expect(promptLatestCommitResponseStub.getCall(0).args[0]).to.be.equal('some-match');
                        expect(promptLatestCommitResponseStub.getCall(0).args[1]).to.be.equal('some-committer');
                        expect(promptLatestCommitResponseStub.getCall(0).args[2]).to.be.equal('some-message');
                        expect(promptLatestCommitResponseStub.getCall(0).args[3]).to.be.equal(responseMock);
                    });
                });
            });
        });
        context('when slots are not valid', function() {
            beforeEach(function() {
                provideLatestCommitSlotsStub.returns({
                    error: 'some-name'
                });
                subject.handleGetLatestCommitRequest('intent', sessionMock, responseMock);
            });

            it('should call the plainTextProvider', function() {
                expect(promptSlotsErrorResponseStub.called).to.be.ok;
                expect(promptSlotsErrorResponseStub.getCall(2).args[0]).to.be.equal(responseMock);
            });
        });
    });
});
