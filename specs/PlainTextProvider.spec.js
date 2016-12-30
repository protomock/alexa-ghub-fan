var expect = require('chai').expect;
var sinon = require('sinon');

describe('PlainTextProvider.js', function() {
    var subject;
    beforeEach(function() {
        subject = require('../src/PlainTextProvider');
    });
    describe('provideCreateRepositoryText', function() {
        var actual;
        beforeEach(function() {
          actual = subject.provideCreateRepositoryText();
        });
        it('should return the expected text', function() {
            expect(actual.speech).to.be.equal('I was able to create the repo successfully.')
            expect(actual.type).to.be.equal('PlainText');
        });

    });

    describe('provideLatestCommitText', function() {
        var actual;
        context('when commiter and owner are not the same', function() {
            beforeEach(function() {
                actual = subject.provideLatestCommitText('some-name','some-commiter', 'some-message', 'some-owner');
            });
            it('should return the correct PlainText object', function() {
                expect(actual.speech).to.be.equal("The latest commit for some-name is some-message made by some-commiter.");
                expect(actual.type).to.be.equal("PlainText");
            });
        });
        context('when commiter and owner are not the same', function() {
            beforeEach(function() {
                actual = subject.provideLatestCommitText('some-name','some-commiter', 'some-message', 'some-commiter');
            });
            it('should return the correct PlainText object', function() {
                expect(actual.speech).to.be.equal("The latest commit for some-name is some-message made by you.");
                expect(actual.type).to.be.equal("PlainText");
            });
        });

    });
    describe('provideSlotsError', function() {
        var actual;
        beforeEach(function() {
            actual = subject.provideSlotsError()
        });
        it('should return the correct PlainText object', function() {
            expect(actual.speech).to.be.equal("I don't think I heard you quite right. Can you try again?");
            expect(actual.type).to.be.equal("PlainText");
        });
    });
    describe('provideApiError', function() {
        var actual;
        beforeEach(function() {
            actual = subject.provideApiError()
        });
        it('should return the correct PlainText object', function() {
            expect(actual.speech).to.be.equal("There seems to be an issue right now. Try again later.");
            expect(actual.type).to.be.equal("PlainText");
        });

    });
});
