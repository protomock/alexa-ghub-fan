var expect = require('chai').expect;
var sinon = require('sinon');

describe('GitHubHelper', function() {
    var subject,
        alexaSkillSpy;
    beforeEach(function() {
        process.env.APP_ID = 'some-id';
        subject = require('../src/GitHubHelper');
        alexaSkillSpy = sinon.spy(binder.objectGraph['AlexaSkill'], 'call');
    });

    afterEach(function() {
        alexaSkillSpy.restore();
    });

    describe('instantiation', function() {
        beforeEach(function() {
            subject();
        });
        it('should call the constructor when instantiating GitHubHelper', function() {
            expect(alexaSkillSpy.called).to.be.ok;
            expect(typeof alexaSkillSpy.getCall(0).args[0]).to.be.equal('object');
            expect(alexaSkillSpy.getCall(0).args[1]).to.be.equal("some-id");
        });
    });

    describe('prototype', function() {
        it('should extend AlexaSkill', function() {
            expect(typeof subject.prototype.eventHandlers).to.be.equal('object');
            expect(typeof subject.prototype.intentHandlers).to.be.equal('object');
        });
        it('should set the constructor', function() {
            expect(subject.prototype.constructor).to.be.equal(subject);
        });
    });
});
