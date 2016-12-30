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
            }
        };
        subject = require('../src/RequestHandlers');
    });

    describe('handleWelcomeRequest', function() {
        var whatCanIdoForYou = "What can I do for you?",
            speechOutput = {
                speech: "Welcome to GitHub Helper. " +
                    whatCanIdoForYou,
                type: 'PlainText'
            },
            repromptOutput = {
                speech: "I can help with doing things such as  " +
                    "creatimg a repo or checking latest commit." +
                    whatCanIdoForYou,
                type: 'PlainText'
            };

        beforeEach(function() {
            subject.handleWelcomeRequest(responseMock);
        });
        it('call ask with the correct parameter', function() {
            expect(askStub.called).to.be.ok;
            expect(askStub.getCall(0).args[0].speech).to.be.equal(speechOutput.speech);
            expect(askStub.getCall(0).args[0].type).to.be.equal(speechOutput.type);
            expect(askStub.getCall(0).args[1].speech).to.be.equal(repromptOutput.speech);
            expect(askStub.getCall(0).args[1].type).to.be.equal(repromptOutput.type);
        });
    });

    describe('handleHelpRequest', function() {
        var whatCanIdoForYou = "What can I do for you?",
            repromptOutput = {
                speech: whatCanIdoForYou,
                type: 'PlainText'
            },
            speechOutput = {
                speech: "I can help with doing things such as  " +
                    "creatimg a repo or checking latest commit." +
                    whatCanIdoForYou,
                type: 'PlainText'
            };

        beforeEach(function() {
            subject.handleHelpRequest(responseMock);
        });
        it('call ask with the correct parameter', function() {
            expect(askStub.called).to.be.ok;
            expect(askStub.getCall(0).args[0].speech).to.be.equal(speechOutput.speech);
            expect(askStub.getCall(0).args[0].type).to.be.equal(speechOutput.type);
            expect(askStub.getCall(0).args[1].speech).to.be.equal(repromptOutput.speech);
            expect(askStub.getCall(0).args[1].type).to.be.equal(repromptOutput.type);
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
                var provideCreateRepositoryTextStub;
                beforeEach(function() {
                    provideCreateRepositoryTextStub = sinon.stub(binder.objectGraph['PlainTextProvider'], 'provideCreateRepositoryText');
                    provideCreateRepositoryTextStub.returns('some-text');
                    createRepositoryStub.getCall(0).args[3]();
                });

                it('should tell the user the request was successful', function() {
                    expect(tellStub.called).to.be.ok;
                    expect(tellStub.getCall(0).args[0]).to.be.equal('some-text');
                });
                afterEach(function() {
                    provideCreateRepositoryTextStub.restore();
                });

            });
            describe('onError', function() {
                var provideApiErrorStub;
                beforeEach(function() {
                    provideApiErrorStub = sinon.stub(binder.objectGraph['PlainTextProvider'], 'provideApiError');
                    provideApiErrorStub.returns('some-error');
                    createRepositoryStub.getCall(0).args[4]();
                });

                it('should call the plainTextProvider', function() {
                    expect(provideApiErrorStub.called).to.be.ok;
                });
                it('should tell the user the request was successful', function() {
                    expect(tellStub.called).to.be.ok;
                    expect(tellStub.getCall(0).args[0]).to.be.equal('some-error');
                });
                afterEach(function() {
                    provideApiErrorStub.restore();
                });

            });
        });
        context('when slots provider returns invalid slots', function() {
            var provideSlotsErrorStub;
            beforeEach(function() {
                provideCreateRepositorySlotsStub.returns({
                    error: true
                });

                provideSlotsErrorStub = sinon.stub(binder.objectGraph['PlainTextProvider'], 'provideSlotsError');
                provideSlotsErrorStub.returns('some-error');

                subject.handleCreateRepositoryRequest('intent', sessionMock, responseMock);
            });

            it('should call the slot provider', function() {
                expect(provideCreateRepositorySlotsStub.called).to.be.ok;
                expect(provideCreateRepositorySlotsStub.getCall(0).args[0]).to.be.equal('intent');
            });
            it('should call the plainTextProvider', function() {
                expect(provideSlotsErrorStub.called).to.be.ok;
            });
            it('should tell the user the request was successful', function() {
                expect(tellStub.called).to.be.ok;
                expect(tellStub.getCall(0).args[0]).to.be.equal('some-error');
            });
            afterEach(function() {
                provideSlotsErrorStub.restore();
            });

        });

        afterEach(function() {
            provideCreateRepositorySlotsStub.restore();
            createRepositoryStub.restore();
        });
    });
    describe('handleListRepositoryRequest', function() {
        var listMyRepositoriesStub,
            provideListOfRepositoriesSSMLStub;
        beforeEach(function() {
            listMyRepositoriesStub = sinon.stub(binder.objectGraph['GitHubClient'], 'listMyRepositories');
            provideListOfRepositoriesSSMLStub = sinon.stub(binder.objectGraph['SSMLProvider'], 'provideListOfRepositoriesSSML');
            subject.handleListRepositoryRequest(sessionMock, responseMock);
        });

        it('should call the GitHubClient with the expected values', function() {
            expect(listMyRepositoriesStub.called).to.be.ok;
            expect(listMyRepositoriesStub.getCall(0).args[0]).to.be.equal('some-token');
            expect(typeof listMyRepositoriesStub.getCall(0).args[1]).to.be.equal('function');
            expect(typeof listMyRepositoriesStub.getCall(0).args[2]).to.be.equal('function');
        });

        describe('onSuccess', function() {
            var speechOutput
            beforeEach(function() {
                speechOutput = {
                    speech: "some-ssml",
                    type: "SSML"
                };
                provideListOfRepositoriesSSMLStub.returns('some-ssml');
                listMyRepositoriesStub.getCall(0).args[1]();
            });

            it('should tell the user the request was successful', function() {
                expect(tellStub.called).to.be.ok;
                expect(tellStub.getCall(0).args[0].speech).to.be.equal(speechOutput.speech);
                expect(tellStub.getCall(0).args[0].type).to.be.equal(speechOutput.type);
            });
        });
        describe('onError', function() {
            var speechOutput
            beforeEach(function() {
                speechOutput = {
                    speech: "There seems to be an issue right now. Try again later.",
                    type: "PlainText"
                };
                listMyRepositoriesStub.getCall(0).args[2]();
            });

            it('should tell the user the request was unsuccessful', function() {
                expect(tellStub.called).to.be.ok;
                expect(tellStub.getCall(0).args[0].speech).to.be.equal(speechOutput.speech);
                expect(tellStub.getCall(0).args[0].type).to.be.equal(speechOutput.type);
            });
        });

        afterEach(function() {
            provideListOfRepositoriesSSMLStub.restore();
            listMyRepositoriesStub.restore();
        });
    });
    describe('handleListAllMyOpenIssuesRequest', function() {
        var listAllMyOpenIssuesStub,
            provideListOfIssuesSSMLStub;
        beforeEach(function() {
            listAllMyOpenIssuesStub = sinon.stub(binder.objectGraph['GitHubClient'], 'listAllMyOpenIssues');
            provideListOfIssuesSSMLStub = sinon.stub(binder.objectGraph['SSMLProvider'], 'provideListOfIssuesSSML');
            subject.handleListAllMyOpenIssuesRequest(sessionMock, responseMock);
        });

        it('should call the GitHubClient with the expected values', function() {
            expect(listAllMyOpenIssuesStub.called).to.be.ok;
            expect(listAllMyOpenIssuesStub.getCall(0).args[0]).to.be.equal('some-token');
            expect(typeof listAllMyOpenIssuesStub.getCall(0).args[1]).to.be.equal('function');
            expect(typeof listAllMyOpenIssuesStub.getCall(0).args[2]).to.be.equal('function');
        });

        describe('onSuccess', function() {
            var speechOutput
            beforeEach(function() {
                speechOutput = {
                    speech: "some-ssml",
                    type: "SSML"
                };
                provideListOfIssuesSSMLStub.returns('some-ssml');
                listAllMyOpenIssuesStub.getCall(0).args[1]();
            });

            it('should tell the user the request was successful', function() {
                expect(tellStub.called).to.be.ok;
                expect(tellStub.getCall(0).args[0].speech).to.be.equal(speechOutput.speech);
                expect(tellStub.getCall(0).args[0].type).to.be.equal(speechOutput.type);
            });
        });
        describe('onError', function() {
            var speechOutput
            beforeEach(function() {
                speechOutput = {
                    speech: "There seems to be an issue right now. Try again later.",
                    type: "PlainText"
                };
                listAllMyOpenIssuesStub.getCall(0).args[2]();
            });

            it('should tell the user the request was unsuccessful', function() {
                expect(tellStub.called).to.be.ok;
                expect(tellStub.getCall(0).args[0].speech).to.be.equal(speechOutput.speech);
                expect(tellStub.getCall(0).args[0].type).to.be.equal(speechOutput.type);
            });
        });

        afterEach(function() {
            provideListOfIssuesSSMLStub.restore();
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
                getMyInfoStub;
            beforeEach(function() {
                getMyInfoStub = sinon.stub(binder.objectGraph['GitHubClient'], 'getMyInfo');
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
                expect(getMyInfoStub.called).to.be.ok;
                expect(getMyInfoStub.getCall(0).args[0]).to.be.equal('some-token');
                expect(typeof getMyInfoStub.getCall(0).args[1]).to.be.equal('function');
                expect(typeof getMyInfoStub.getCall(0).args[2]).to.be.equal('function');
            });

            describe('onSuccess', function() {
                var output;
                beforeEach(function() {
                    output = {
                        login: "some-owner"
                    };
                    getMyInfoStub.getCall(0).args[1](output);
                });

                it('should call the GitHubClient with the expected values', function() {
                    expect(getLatestCommitStub.called).to.be.ok;
                    expect(getLatestCommitStub.getCall(0).args[0]).to.be.equal('some-name');
                    expect(getLatestCommitStub.getCall(0).args[1]).to.be.equal('some-owner');
                    expect(getLatestCommitStub.getCall(0).args[2]).to.be.equal('some-token');
                    expect(typeof getLatestCommitStub.getCall(0).args[3]).to.be.equal('function');
                    expect(typeof getLatestCommitStub.getCall(0).args[4]).to.be.equal('function');
                });

                describe('getLatestCommit - onSuccess', function() {
                    var speechOutput,
                        provideLatestCommitTextStub,
                        output;
                    beforeEach(function() {
                        provideLatestCommitTextStub = sinon.stub(binder.objectGraph['PlainTextProvider'], 'provideLatestCommitText');
                        provideLatestCommitTextStub.returns('some-text');

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
                        provideLatestCommitTextStub.restore();
                    });

                    it('should call plainTextProvider', function() {
                        expect(provideLatestCommitTextStub.called).to.be.ok;
                        expect(provideLatestCommitTextStub.getCall(0).args[0]).to.be.equal('some-name');
                        expect(provideLatestCommitTextStub.getCall(0).args[1]).to.be.equal('some-committer');
                        expect(provideLatestCommitTextStub.getCall(0).args[2]).to.be.equal('some-message');
                        expect(provideLatestCommitTextStub.getCall(0).args[3]).to.be.equal('some-owner');
                    });

                    it('should tell the user the request was successful', function() {
                        expect(tellStub.called).to.be.ok;
                        expect(tellStub.getCall(0).args[0]).to.be.equal('some-text');
                    });
                });
                describe('getLatestCommit - onError', function() {
                    var provideApiErrorStub;
                    beforeEach(function() {
                        provideApiErrorStub = sinon.stub(binder.objectGraph['PlainTextProvider'], 'provideApiError');
                        provideApiErrorStub.returns('some-error');

                        getLatestCommitStub.getCall(0).args[4]();
                    });
                    afterEach(function() {
                        provideApiErrorStub.restore();
                    });


                    it('should tell the user the request was unsuccessful', function() {
                        expect(tellStub.called).to.be.ok;
                        expect(tellStub.getCall(0).args[0]).to.be.equal('some-error');
                    });
                });
            });
            describe('onError', function() {
                var provideApiErrorStub;
                beforeEach(function() {
                    provideApiErrorStub = sinon.stub(binder.objectGraph['PlainTextProvider'], 'provideApiError');
                    provideApiErrorStub.returns('some-error');

                    getMyInfoStub.getCall(0).args[2]();
                });
                afterEach(function() {
                    provideApiErrorStub.restore();
                });

                it('should tell the user the request was unsuccessful', function() {
                    expect(tellStub.called).to.be.ok;
                    expect(tellStub.getCall(0).args[0]).to.be.equal('some-error');
                });
            });

            afterEach(function() {
                getMyInfoStub.restore();
                getLatestCommitStub.restore();
            });
        });
        context('when slots are not valid', function() {
            var provideSlotsErrorStub;
            beforeEach(function() {
                provideLatestCommitSlotsStub.returns({
                    error: 'some-name'
                });
                provideSlotsErrorStub = sinon.stub(binder.objectGraph['PlainTextProvider'], 'provideSlotsError');
                provideSlotsErrorStub.returns('some-error');
                subject.handleGetLatestCommitRequest('intent', sessionMock, responseMock);
            });

            it('should call the plainTextProvider', function() {
                expect(provideSlotsErrorStub.called).to.be.ok;
            });
            it('should tell the user the request was successful', function() {
                expect(tellStub.called).to.be.ok;
                expect(tellStub.getCall(0).args[0]).to.be.equal('some-error');
            });
            afterEach(function() {
                provideSlotsErrorStub.restore();
            });

        });

        afterEach(function() {
            provideLatestCommitSlotsStub.restore();
        });
    });
});
