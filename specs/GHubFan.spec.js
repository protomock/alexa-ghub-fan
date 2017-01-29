var expect = require('chai').expect;
var sinon = require('sinon');
var mockInjector = require('mock-injector')(__dirname);
var alexaSkill = require('../src/AlexaSkill');

describe('RepoHead', function() {
    var subject,
        alexaSkillSpy;
    beforeEach(function() {
        process.env.APP_ID = 'some-id';
        alexaSkillSpy = sinon.spy(alexaSkill, 'call');
        mockInjector.inject('AlexaSkill', alexaSkill);
        mockInjector.inject('../src/IntentHandlers','Intent-Handlers');
        mockInjector.inject('../src/EventHandlers','Event-Handlers');
        subject = mockInjector.subject('../src/RepoHead');
    });

    afterEach(function() {
        alexaSkillSpy.restore();
    });

    describe('instantiation', function() {
        beforeEach(function() {
            subject();
        });
        it('should call the constructor when instantiating RepoHead', function() {
            expect(alexaSkillSpy.called).to.be.ok;
            expect(typeof alexaSkillSpy.getCall(0).args[0]).to.be.equal('object');
            expect(alexaSkillSpy.getCall(0).args[1]).to.be.equal("some-id");
        });
    });

    describe('prototype', function() {
        it('should extend AlexaSkill', function() {
            expect(subject.prototype.eventHandlers).to.be.equal('Intent-Handlers');
            expect(subject.prototype.intentHandlers).to.be.equal('Event-Handlers');
        });
        it('should set the constructor', function() {
            expect(subject.prototype.constructor).to.be.equal(subject);
        });
    });
});
