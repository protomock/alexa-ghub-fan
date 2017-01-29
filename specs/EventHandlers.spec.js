var expect = require('chai').expect;
var sinon = require('sinon');
var mockInjector = require('mock-injector')(__dirname);
var requestHandlers = require('../src/RequestHandlers');
var fetcher = require('../src/InformationFetcher');

describe('EventHandlers.js', function() {
    var subject;
    beforeEach(function() {
        handleWelcomeRequestStub = sinon.stub(requestHandlers, 'handleWelcomeRequest');
        handleUnLinkedWelcomeRequestStub = sinon.stub(requestHandlers, 'handleUnLinkedWelcomeRequest');
        getUserInformationStub = sinon.stub(fetcher, 'getUserInformation');
        subject = mockInjector.subject('../src/EventHandlers');
    });
    afterEach(function() {
        getUserInformationStub.restore();
        handleWelcomeRequestStub.restore();
        handleUnLinkedWelcomeRequestStub.restore();
    });
    describe('onLaunch', function() {
        beforeEach(function() {
            subject.onLaunch('LaunchRequest', 'session', 'response');
        });
        it('should handle the welcome request', function() {
            expect(handleWelcomeRequestStub.called).to.be.ok;
            expect(handleWelcomeRequestStub.getCall(0).args[0]).to.be.equal('session');
            expect(handleWelcomeRequestStub.getCall(0).args[1]).to.be.equal('response');
        });
    });
    describe('onInvocation', function() {
        var sessionMock;
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
            beforeEach(function() {
                sessionMock = {
                    user: {}
                };
                subject.onInvocation(sessionMock, 'response', 'success');
            });

            it('should not get user information', function() {
                expect(handleUnLinkedWelcomeRequestStub.called).to.be.ok;
                expect(handleUnLinkedWelcomeRequestStub.getCall(0).args[0]).to.be.equal('response');

            });
        });
    });
});
