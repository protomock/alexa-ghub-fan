var expect = require('chai').expect;
var sinon = require('sinon');
var mockInjector = require('mock-injector')(__dirname);

describe('PlainTextResponder.js', function() {
    var subject,
        responseMock,
        tellStub,
        askStub,
        tellWithCardStub;

    beforeEach(function() {
        tellStub = sinon.stub();
        askStub = sinon.stub();
        tellWithCardStub = sinon.stub();

        responseMock = {
            tell: tellStub,
            tellWithCard: tellWithCardStub,
            ask: askStub
        };
        subject = mockInjector.subject('../src/PlainTextResponder');
    });

    describe('promptUnlinkedWelcomeResponse', function() {
        var speech;
        beforeEach(function() {
            speech = 'Thanks for trying out this skill, unfortunely the features I ' +
                'provide only work if you have linked your account. ' +
                'Please take a look at the card in your alexa app for more information. ';
            subject.promptUnlinkedWelcomeResponse(responseMock);
        });

        it('call askWithCard with the correct parameter', function() {
            expect(tellWithCardStub.called).to.be.ok;
            expect(tellWithCardStub.getCall(0).args[0].speech).to.be.equal(speech);
            expect(tellWithCardStub.getCall(0).args[0].type).to.be.equal('PlainText');
            expect(tellWithCardStub.getCall(0).args[1]).to.be.equal('Account Link Required');
            expect(tellWithCardStub.getCall(0).args[2]).to.be.equal('No account linked');
            expect(tellWithCardStub.getCall(0).args[3]).to.be.equal('LinkAccount');
        });
    });

    describe('promptWelcomeResponse', function() {
        var whatCanIdoForYou,
            speechOutput,
            repromptOutput;
        beforeEach(function() {
            whatCanIdoForYou = 'What can I do for you? ';
            speechOutput = {
                speech: 'Hi firstName, Repo Head here. ' +
                    whatCanIdoForYou,
                type: 'PlainText'
            };
            repromptOutput = {
                speech: 'I can help with doing things such as ' +
                    'creating a repo or checking latest commit. ' +
                    whatCanIdoForYou,
                type: 'PlainText'
            };
            subject.promptWelcomeResponse('firstName', responseMock);
        });
        it('call ask with the correct parameter', function() {
            expect(askStub.called).to.be.ok;
            expect(askStub.getCall(0).args[0].speech).to.be.equal(speechOutput.speech);
            expect(askStub.getCall(0).args[0].type).to.be.equal(speechOutput.type);
            expect(askStub.getCall(0).args[1].speech).to.be.equal(repromptOutput.speech);
            expect(askStub.getCall(0).args[1].type).to.be.equal(repromptOutput.type);
        });

        context('when first name is null', function() {
            beforeEach(function() {
               speechOutput.speech = 'Repo Head here. ' + whatCanIdoForYou;
               subject.promptWelcomeResponse(null, responseMock);
            });

            it('call ask with the correct parameter', function() {
                expect(askStub.called).to.be.ok;
                expect(askStub.getCall(0).args[0].speech).to.be.equal(speechOutput.speech);
                expect(askStub.getCall(0).args[0].type).to.be.equal(speechOutput.type);
                expect(askStub.getCall(0).args[1].speech).to.be.equal(repromptOutput.speech);
                expect(askStub.getCall(0).args[1].type).to.be.equal(repromptOutput.type);
            });
        });
    });

    describe('promptHelpResponse', function() {
        var whatCanIdoForYou,
            speechOutput,
            repromptOutput;
        beforeEach(function() {
            whatCanIdoForYou = 'What can I do for you? ';
            repromptOutput = {
                speech: whatCanIdoForYou,
                type: 'PlainText'
            };
            speechOutput = {
                speech: 'I can help with doing things such as ' +
                    'creating a repo or checking latest commit. ' +
                    whatCanIdoForYou,
                type: 'PlainText'
            };
            subject.promptHelpResponse(responseMock);
        });
        it('call ask with the correct parameter', function() {
            expect(askStub.called).to.be.ok;
            expect(askStub.getCall(0).args[0].speech).to.be.equal(speechOutput.speech);
            expect(askStub.getCall(0).args[0].type).to.be.equal(speechOutput.type);
            expect(askStub.getCall(0).args[1].speech).to.be.equal(repromptOutput.speech);
            expect(askStub.getCall(0).args[1].type).to.be.equal(repromptOutput.type);
        });
    });

    describe('promptStopResponse', function() {
        beforeEach(function() {
            subject.promptStopResponse(responseMock);
        });
        it('should call tell with correct parameters', function() {
            expect(tellStub.called).to.be.ok;
            expect(tellStub.getCall(0).args[0].speech).to.be.equal('It was good talking with you. Happy developing! ');
            expect(tellStub.getCall(0).args[0].type).to.be.equal('PlainText');
        });
    });

    describe('promptCreateRepositoryResponse', function() {
        beforeEach(function() {
            subject.promptCreateRepositoryResponse('some-name',responseMock);
        });
        it('should call tell with correct parameters', function() {
            expect(tellStub.called).to.be.ok;
            expect(tellStub.getCall(0).args[0].speech).to.be.equal('Alright, I created some-name for you. ');
            expect(tellStub.getCall(0).args[0].type).to.be.equal('PlainText');
        });

    });

    describe('promptLatestCommitResponse', function() {
        beforeEach(function() {
            subject.promptLatestCommitResponse('some-name', 'some-commiter', 'some-message', responseMock);
        });
        it('should call tell with correct parameters', function() {
            expect(tellStub.called).to.be.ok;
            expect(tellStub.getCall(0).args[0].speech).to.be.equal('The latest commit for some-name is some-message made by some-commiter. ');
            expect(tellStub.getCall(0).args[0].type).to.be.equal('PlainText');
        });

    });
    describe('provideSlotsError', function() {
        beforeEach(function() {
            subject.promptSlotsErrorResponse(responseMock)
        });
        it('should call tell with correct parameters', function() {
            expect(askStub.called).to.be.ok;
            expect(askStub.getCall(0).args[0].speech).to.be.equal('I don\'t think I heard you quite right. Can you try again? ');
            expect(askStub.getCall(0).args[0].type).to.be.equal('PlainText');
            expect(askStub.getCall(0).args[1].speech).to.be.equal('I\'m still trying to work out the kinks. Please try again. ');
            expect(askStub.getCall(0).args[1].type).to.be.equal('PlainText');
        });
    });
    describe('provideApiError', function() {
        beforeEach(function() {
            subject.promptApiErrorResponse(responseMock)
        });
        it('should call tell with correct parameters', function() {
            expect(tellStub.called).to.be.ok;
            expect(tellStub.getCall(0).args[0].speech).to.be.equal('There seems to be an issue right now. Try again later. ');
            expect(tellStub.getCall(0).args[0].type).to.be.equal('PlainText');
        });
    });

    describe('promptRepoEmptyError', function() {
        beforeEach(function() {
            subject.promptRepoEmptyError('some-repo', responseMock)
        });
        it('should call tell with correct parameters', function() {
            expect(tellStub.called).to.be.ok;
            expect(tellStub.getCall(0).args[0].speech).to.be.equal('There are no commits for some-repo. ');
            expect(tellStub.getCall(0).args[0].type).to.be.equal('PlainText');
        });
    });

    describe('promptRepoAlreadyExistsError', function() {
        beforeEach(function() {
            subject.promptRepoAlreadyExistsError('some-repo', responseMock)
        });
        it('should call tell with correct parameters', function() {
            expect(tellStub.called).to.be.ok;
            expect(tellStub.getCall(0).args[0].speech).to.be.equal('Repository some-repo already exists. ');
            expect(tellStub.getCall(0).args[0].type).to.be.equal('PlainText');
        });
    });

    describe('promptAccountReLinkResponse', function() {
        beforeEach(function() {
            subject.promptAccountReLinkResponse( responseMock)
        });
        it('should call tell with correct parameters', function() {
            expect(tellStub.called).to.be.ok;
            expect(tellStub.getCall(0).args[0].speech).to.be.equal('It seems there maybe an issue with your account linking. Please relink your account and try again. ');
            expect(tellStub.getCall(0).args[0].type).to.be.equal('PlainText');
        });
    });
});
