var expect = require('chai').expect;
var sinon = require('sinon');

describe('PlainTextResponder.js', function() {
    var subject,
        responseMock,
        tellStub,
        askStub;
    beforeEach(function() {
        tellStub = sinon.stub();
        askStub = sinon.stub();
        responseMock = {
            tell: tellStub,
            ask: askStub
        };
        subject = require('../src/PlainTextResponder');
    });
    describe('promptWelcomeResponse', function() {
        var whatCanIdoForYou,
            speechOutput,
            repromptOutput;
        beforeEach(function() {
            whatCanIdoForYou = "What can I do for you?";
            speechOutput = {
                speech: "Welcome to GitHub Helper. " +
                    whatCanIdoForYou,
                type: 'PlainText'
            };
            repromptOutput = {
                speech: "I can help with doing things such as " +
                    "creating a repo or checking latest commit." +
                    whatCanIdoForYou,
                type: 'PlainText'
            };
            subject.promptWelcomeResponse(responseMock);
        });
        it('call ask with the correct parameter', function() {
            expect(askStub.called).to.be.ok;
            expect(askStub.getCall(0).args[0].speech).to.be.equal(speechOutput.speech);
            expect(askStub.getCall(0).args[0].type).to.be.equal(speechOutput.type);
            expect(askStub.getCall(0).args[1].speech).to.be.equal(repromptOutput.speech);
            expect(askStub.getCall(0).args[1].type).to.be.equal(repromptOutput.type);
        });
    });

    describe('promptHelpResponse', function() {
        var whatCanIdoForYou,
            speechOutput,
            repromptOutput;
        beforeEach(function() {
            whatCanIdoForYou = "What can I do for you?";
            repromptOutput = {
                speech: whatCanIdoForYou,
                type: 'PlainText'
            };
            speechOutput = {
                speech: "I can help with doing things such as " +
                    "creating a repo or checking latest commit." +
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
        it('should call tell with correct parametes', function() {
            expect(tellStub.called).to.be.ok;
            expect(tellStub.getCall(0).args[0].speech).to.be.equal('Goodbye.');
            expect(tellStub.getCall(0).args[0].type).to.be.equal('PlainText');
        });
    });

    describe('promptCreateRepositoryReponse', function() {
        beforeEach(function() {
            subject.promptCreateRepositoryReponse(responseMock);
        });
        it('should call tell with correct parametes', function() {
            expect(tellStub.called).to.be.ok;
            expect(tellStub.getCall(0).args[0].speech).to.be.equal('I was able to create the repo successfully.');
            expect(tellStub.getCall(0).args[0].type).to.be.equal('PlainText');
        });

    });

    describe('promptLatestCommitResponse', function() {
        beforeEach(function() {
            subject.promptLatestCommitResponse('some-name', 'some-commiter', 'some-message', responseMock);
        });
        it('should call tell with correct parametes', function() {
            expect(tellStub.called).to.be.ok;
            expect(tellStub.getCall(0).args[0].speech).to.be.equal('The latest commit for some-name is some-message made by some-commiter.');
            expect(tellStub.getCall(0).args[0].type).to.be.equal('PlainText');
        });

    });
    describe('provideSlotsError', function() {
        beforeEach(function() {
            subject.promptSlotsErrorResponse(responseMock)
        });
        it('should call tell with correct parametes', function() {
            expect(tellStub.called).to.be.ok;
            expect(tellStub.getCall(0).args[0].speech).to.be.equal('I don\'t think I heard you quite right. Can you try again?');
            expect(tellStub.getCall(0).args[0].type).to.be.equal('PlainText');
        });
    });
    describe('provideApiError', function() {
        beforeEach(function() {
            subject.promptApiErrorResponse(responseMock)
        });
        it('should call tell with correct parametes', function() {
            expect(tellStub.called).to.be.ok;
            expect(tellStub.getCall(0).args[0].speech).to.be.equal('There seems to be an issue right now. Try again later.');
            expect(tellStub.getCall(0).args[0].type).to.be.equal('PlainText');
        });
    });
});
