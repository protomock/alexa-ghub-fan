var expect = require('chai').expect;
var sinon = require('sinon');

describe('EventHandlers.js', function() {
    var subject;
    beforeEach(function() {
        subject = require('../src/EventHandlers');
    });
    describe('onSessionStarted', function() {
        var handleSessionStartStub;
        beforeEach(function() {
            handleSessionStartStub = sinon.stub(binder.objectGraph['RequestHandlers'], 'handleSessionStarted');
            subject.onSessionStarted('LaunchRequest', 'session', 'response');
        });
        it('should handle the welcome request', function() {
            expect(handleSessionStartStub.called).to.be.ok;
            expect(handleSessionStartStub.getCall(0).args[0]).to.be.equal('session');
        });
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

});
