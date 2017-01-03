var expect = require('chai').expect;
var sinon = require('sinon');

describe('RequestHandlers.js', function() {
    var subject,
        responseMock,
        askStub,
        tellStub,
        sessionMock;
    beforeEach(function() {
        delete require.cache[require.resolve('../src/RequestHandlers')];
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
        subject = require('../src/RequestHandlers');
    });

    describe('handleSessionStarted', function() {
        var getMyInfoStub;
        beforeEach(function() {
            getMyInfoStub = sinon.stub(binder.objectGraph['GitHubClient'], 'getMyInfo');
            subject.handleSessionStarted(sessionMock);
        });
        afterEach(function() {
            getMyInfoStub.restore();
        });

        it('should call GitHubClient with the correct parameters', function() {
            expect(getMyInfoStub.called).to.be.ok;
            expect(getMyInfoStub.getCall(0).args[0]).to.be.equal("some-token");
            expect(typeof getMyInfoStub.getCall(0).args[1]).to.be.equal('function');
            expect(typeof getMyInfoStub.getCall(0).args[2]).to.be.equal('object');
        });
        describe('onSuccess', function() {
            var data;
            beforeEach(function() {
                data = {
                    login: 'some-owner'
                };
                getMyInfoStub.getCall(0).args[1](data);
            });
            it('should set the owner attribute', function() {
                expect(sessionMock.attributes['owner']).to.be.equal('some-owner');
            });
        });

        // describe('onError', function() {
        //     var promptApiErrorResponseStub;
        //     beforeEach(function() {
        //         promptApiErrorResponseStub = sinon.stub(binder.objectGraph['PlainTextResponder'], 'promptApiErrorResponse');
        //         getMyInfoStub.getCall(0).args[2]();
        //     });
        //
        //     it('should tell the user the request was incorrect', function() {
        //         expect(promptApiErrorResponseStub.called).to.be.ok;
        //         expect(promptApiErrorResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
        //     });
        //     afterEach(function() {
        //         promptApiErrorResponseStub.restore();
        //     });
        //
        // });

    });

    describe('handleWelcomeRequest', function() {
        var promptWelcomeResponseStub;
        beforeEach(function() {
            promptWelcomeResponseStub = sinon.stub(binder.objectGraph['PlainTextResponder'], 'promptWelcomeResponse');
            subject.handleWelcomeRequest(responseMock);
        });
        it('should prompt the user as expected', function() {
            expect(promptWelcomeResponseStub.called).to.be.ok;
            expect(promptWelcomeResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
        });
    });

    describe('handleHelpRequest', function() {
        var promptHelpResponseStub;
        beforeEach(function() {
            promptHelpResponseStub = sinon.stub(binder.objectGraph['PlainTextResponder'], 'promptHelpResponse');
            subject.handleHelpRequest(responseMock);
        });
        it('should prompt the user as expected', function() {
            expect(promptHelpResponseStub.called).to.be.ok;
            expect(promptHelpResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
        });

    });

    describe('handleStopIntent', function() {
        var promptStopResponseStub;
        beforeEach(function() {
            promptStopResponseStub = sinon.stub(binder.objectGraph['PlainTextResponder'], 'promptStopResponse');
            subject.handleStopIntent(responseMock);
        });
        it('should prompt the user as expected', function() {
            expect(promptStopResponseStub.called).to.be.ok;
            expect(promptStopResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
        });
    });
    describe('handleCreateRepositoryRequest', function() {
        var provideCreateRepositorySlotsStub,
            createRepositoryStub,
            speechOutput;
        beforeEach(function() {
            provideCreateRepositorySlotsStub = sinon.stub(binder.objectGraph['SlotProvider'], 'provideCreateRepositorySlots');
            createRepositoryStub = sinon.stub(binder.objectGraph['GitHubClient'], 'createRepository');
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
                expect(typeof createRepositoryStub.getCall(0).args[4]).to.be.equal('function');
            });

            describe('onSuccess', function() {
                var promptCreateRepositoryReponseStub;
                beforeEach(function() {
                    promptCreateRepositoryReponseStub = sinon.stub(binder.objectGraph['PlainTextResponder'], 'promptCreateRepositoryReponse');
                    createRepositoryStub.getCall(0).args[3]();
                });

                it('should tell the user the request was successful', function() {
                    expect(promptCreateRepositoryReponseStub.called).to.be.ok;
                    expect(promptCreateRepositoryReponseStub.getCall(0).args[0]).to.be.equal(responseMock);
                });
                afterEach(function() {
                    promptCreateRepositoryReponseStub.restore();
                });

            });
            describe('onError', function() {
                var promptApiErrorResponseStub;
                beforeEach(function() {
                    promptApiErrorResponseStub = sinon.stub(binder.objectGraph['PlainTextResponder'], 'promptApiErrorResponse');
                    createRepositoryStub.getCall(0).args[4]();
                });

                it('should tell the user the request was incorrect', function() {
                    expect(promptApiErrorResponseStub.called).to.be.ok;
                    expect(promptApiErrorResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
                });
                afterEach(function() {
                    promptApiErrorResponseStub.restore();
                });

            });
        });
        context('when slots provider returns invalid slots', function() {
            var promptSlotsErrorResponseStub;
            beforeEach(function() {
                provideCreateRepositorySlotsStub.returns({
                    error: true
                });
                promptSlotsErrorResponseStub = sinon.stub(binder.objectGraph['PlainTextResponder'], 'promptSlotsErrorResponse');

                subject.handleCreateRepositoryRequest('intent', sessionMock, responseMock);
            });

            it('should call the slot provider', function() {
                expect(provideCreateRepositorySlotsStub.called).to.be.ok;
                expect(provideCreateRepositorySlotsStub.getCall(0).args[0]).to.be.equal('intent');
            });
            it('should tell the user that alexa could not understand', function() {
                expect(promptSlotsErrorResponseStub.called).to.be.ok;
                expect(promptSlotsErrorResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
            });
            afterEach(function() {
                promptSlotsErrorResponseStub.restore();
            });

        });

        afterEach(function() {
            provideCreateRepositorySlotsStub.restore();
            createRepositoryStub.restore();
        });
    });
    describe('handleListRepositoryRequest', function() {
        var listMyRepositoriesStub,
            promptListOfRepositoriesResponseStub;
        beforeEach(function() {
            listMyRepositoriesStub = sinon.stub(binder.objectGraph['GitHubClient'], 'listMyRepositories');
            promptListOfRepositoriesResponseStub = sinon.stub(binder.objectGraph['SSMLResponder'], 'promptListOfRepositoriesResponse');
            subject.handleListRepositoryRequest(sessionMock, responseMock);
        });

        it('should call the GitHubClient with the expected values', function() {
            expect(listMyRepositoriesStub.called).to.be.ok;
            expect(listMyRepositoriesStub.getCall(0).args[0]).to.be.equal('some-token');
            expect(typeof listMyRepositoriesStub.getCall(0).args[1]).to.be.equal('function');
            expect(typeof listMyRepositoriesStub.getCall(0).args[2]).to.be.equal('function');
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
        describe('onError', function() {
            var promptApiErrorResponseStub;
            beforeEach(function() {
                promptApiErrorResponseStub = sinon.stub(binder.objectGraph['PlainTextResponder'], 'promptApiErrorResponse');
                listMyRepositoriesStub.getCall(0).args[2]();
            });

            it('should tell the user the request was incorrect', function() {
                expect(promptApiErrorResponseStub.called).to.be.ok;
                expect(promptApiErrorResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
            });
            afterEach(function() {
                promptApiErrorResponseStub.restore();
            });
        });

        afterEach(function() {
            promptListOfRepositoriesResponseStub.restore();
            listMyRepositoriesStub.restore();
        });
    });
    describe('handleListAllMyOpenIssuesRequest', function() {
        var listAllMyOpenIssuesStub,
            promptListOfIssuesResponseStub;
        beforeEach(function() {
            listAllMyOpenIssuesStub = sinon.stub(binder.objectGraph['GitHubClient'], 'listAllMyOpenIssues');
            promptListOfIssuesResponseStub = sinon.stub(binder.objectGraph['SSMLResponder'], 'promptListOfIssuesResponse');
            subject.handleListAllMyOpenIssuesRequest(sessionMock, responseMock);
        });

        it('should call the GitHubClient with the expected values', function() {
            expect(listAllMyOpenIssuesStub.called).to.be.ok;
            expect(listAllMyOpenIssuesStub.getCall(0).args[0]).to.be.equal('some-token');
            expect(typeof listAllMyOpenIssuesStub.getCall(0).args[1]).to.be.equal('function');
            expect(typeof listAllMyOpenIssuesStub.getCall(0).args[2]).to.be.equal('function');
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
        describe('onError', function() {
            var promptApiErrorResponseStub;
            beforeEach(function() {
                promptApiErrorResponseStub = sinon.stub(binder.objectGraph['PlainTextResponder'], 'promptApiErrorResponse');
                listAllMyOpenIssuesStub.getCall(0).args[2]();
            });

            it('should tell the user the request was incorrect', function() {
                expect(promptApiErrorResponseStub.called).to.be.ok;
                expect(promptApiErrorResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
            });

            afterEach(function() {
                promptApiErrorResponseStub.restore();
            });
        });

        afterEach(function() {
            promptListOfIssuesResponseStub.restore();
            listAllMyOpenIssuesStub.restore();
        });
    });
    describe('handleGetLatestCommitRequest', function() {
        var provideLatestCommitSlotsStub;
        beforeEach(function() {
            provideLatestCommitSlotsStub = sinon.stub(binder.objectGraph['SlotProvider'], 'provideLatestCommitSlots');
        });

        context('when slots are valid', function() {
            var listAllMyOpenIssuesStub,
                listMyRepositoriesStub;
            beforeEach(function() {
                listMyRepositoriesStub = sinon.stub(binder.objectGraph['GitHubClient'], 'listMyRepositories');
                getLatestCommitStub = sinon.stub(binder.objectGraph['GitHubClient'], 'getLatestCommit');
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
                expect(typeof listMyRepositoriesStub.getCall(0).args[2]).to.be.equal('function');
            });

            describe('onSuccess', function() {
                var output,
                    matchStub;
                beforeEach(function() {
                    matchStub = sinon.stub(binder.objectGraph['StringMatcher'], 'match');
                    matchStub.returns('some-match');

                    sessionMock.attributes['owner'] = 'some-owner';
                    listMyRepositoriesStub.getCall(0).args[1]('some-data');
                });

                afterEach(function() {
                    matchStub.restore();
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
                    expect(typeof getLatestCommitStub.getCall(0).args[4]).to.be.equal('function');
                });

                describe('getLatestCommit - onSuccess', function() {
                    var promptLatestCommitResponseStub,
                        output;
                    beforeEach(function() {
                        promptLatestCommitResponseStub = sinon.stub(binder.objectGraph['PlainTextResponder'], 'promptLatestCommitResponse');
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
                    afterEach(function() {
                        promptLatestCommitResponseStub.restore();
                    });

                    it('should call plainTextProvider', function() {
                        expect(promptLatestCommitResponseStub.called).to.be.ok;
                        expect(promptLatestCommitResponseStub.getCall(0).args[0]).to.be.equal('some-match');
                        expect(promptLatestCommitResponseStub.getCall(0).args[1]).to.be.equal('some-committer');
                        expect(promptLatestCommitResponseStub.getCall(0).args[2]).to.be.equal('some-message');
                        expect(promptLatestCommitResponseStub.getCall(0).args[3]).to.be.equal(responseMock);
                    });
                });
                describe('getLatestCommit - onError', function() {
                    var promptApiErrorResponseStub;
                    beforeEach(function() {
                        promptApiErrorResponseStub = sinon.stub(binder.objectGraph['PlainTextResponder'], 'promptApiErrorResponse');
                        getLatestCommitStub.getCall(0).args[4]();
                    });

                    it('should tell the user the request was incorrect', function() {
                        expect(promptApiErrorResponseStub.called).to.be.ok;
                        expect(promptApiErrorResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
                    });

                    afterEach(function() {
                        promptApiErrorResponseStub.restore();
                    });
                });
            });
            describe('onError', function() {
                var promptApiErrorResponseStub;
                beforeEach(function() {
                    promptApiErrorResponseStub = sinon.stub(binder.objectGraph['PlainTextResponder'], 'promptApiErrorResponse');
                    listMyRepositoriesStub.getCall(0).args[2]();
                });

                it('should tell the user the request was incorrect', function() {
                    expect(promptApiErrorResponseStub.called).to.be.ok;
                    expect(promptApiErrorResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
                });

                afterEach(function() {
                    promptApiErrorResponseStub.restore();
                });
            });

            afterEach(function() {
                listMyRepositoriesStub.restore();
                getLatestCommitStub.restore();
            });
        });
        context('when slots are not valid', function() {
            var promptSlotsErrorResponseStub;
            beforeEach(function() {
                provideLatestCommitSlotsStub.returns({
                    error: 'some-name'
                });
                promptSlotsErrorResponseStub = sinon.stub(binder.objectGraph['PlainTextResponder'], 'promptSlotsErrorResponse');
                subject.handleGetLatestCommitRequest('intent', sessionMock, responseMock);
            });

            it('should call the plainTextProvider', function() {
                expect(promptSlotsErrorResponseStub.called).to.be.ok;
                expect(promptSlotsErrorResponseStub.getCall(0).args[0]).to.be.equal(responseMock);
            });
            afterEach(function() {
                promptSlotsErrorResponseStub.restore();
            });

        });

        afterEach(function() {
            provideLatestCommitSlotsStub.restore();
        });
    });
});
