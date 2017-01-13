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
    describe('onInvocation', function() {
        var sessionMock,
            getUserInformationStub;
        beforeEach(function() {
            getUserInformationStub = sinon.stub(binder.objectGraph['InformationFetcher'], 'getUserInformation');
        });
        afterEach(function() {
            getUserInformationStub.restore();
        });

        context('when user has accessToken', function() {
            beforeEach(function() {
                sessionMock = {
                    user: {
                        accessToken: 'some-token'
                    }
                };
                subject.onInvocation(sessionMock, 'response', 'success');
            });

            it('should handle the welcome request', function() {
                expect(getUserInformationStub.called).to.be.ok;
                expect(getUserInformationStub.getCall(0).args[0]).to.be.equal(sessionMock);
                expect(getUserInformationStub.getCall(0).args[1]).to.be.equal('response');
                expect(getUserInformationStub.getCall(0).args[2]).to.be.equal('success');
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
                subject.onInvocation(sessionMock, 'response', 'success');
            });

            it('should not get user information', function() {
                expect(handleUnLinkedWelcomeRequestStub.called).to.be.ok;
                expect(handleUnLinkedWelcomeRequestStub.getCall(0).args[0]).to.be.equal('response');

            });
        });
    });
});
