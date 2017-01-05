var expect = require('chai').expect;
var sinon = require('sinon');

describe('EventHandlers.js', function() {
    var subject;
    beforeEach(function() {
        subject = require('../src/EventHandlers');
    });
    describe('onLaunch', function() {
        var handleWelcomeRequestStub;
        beforeEach(function() {
            handleWelcomeRequestStub = sinon.stub(binder.objectGraph['RequestHandlers'], 'handleWelcomeRequest');
            subject.onLaunch('LaunchRequest', 'session', 'response');
        });
        it('should handle the welcome request', function() {
            expect(handleWelcomeRequestStub.called).to.be.ok;
            expect(handleWelcomeRequestStub.getCall(0).args[0]).to.be.equal('response');
        });
    });
    describe('onEngaged', function() {
        var sessionMock;
        context('when user has accessToken', function() {
            var getUserInformationStub;
            beforeEach(function() {
                sessionMock = {
                  user: {
                    accessToken: 'some-token'
                  }
                };
                getUserInformationStub = sinon.stub(binder.objectGraph['InformationFetcher'], 'getUserInformation');
                subject.onEngaged(sessionMock,'response', 'success');
            });
            afterEach(function() {
               getUserInformationStub.restore();
            });

            it('should handle the welcome request', function() {
                expect(getUserInformationStub.called).to.be.ok;
                expect(getUserInformationStub.getCall(0).args[0]).to.be.equal(sessionMock);
                expect(getUserInformationStub.getCall(0).args[1]).to.be.equal('success');
            });
        });

        var sessionMock;
        context('when user does not have an accessToken', function() {
            var handleUnLinkedWelcomeRequestStub;
            beforeEach(function() {
                sessionMock = {
                  user: {}
                };
                handleUnLinkedWelcomeRequestStub = sinon.stub(binder.objectGraph['RequestHandlers'], 'handleUnLinkedWelcomeRequest');
                subject.onEngaged(sessionMock, 'response', 'success');
            });
            afterEach(function() {
               handleUnLinkedWelcomeRequestStub.restore();
            });

            it('should handle the welcome request', function() {
                expect(handleUnLinkedWelcomeRequestStub.called).to.be.ok;
                expect(handleUnLinkedWelcomeRequestStub.getCall(0).args[0]).to.be.equal('response');
            });
        });
    });
});
