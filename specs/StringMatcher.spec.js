var expect = require('chai').expect;
var sinon = require('sinon');

describe('StringMatcher.js', function() {
    var subject;
    beforeEach(function() {
        subject = require('../src/StringMatcher');
    });

    describe('distanceBetween', function() {
        context('when the word is an exact match', function() {
            var actual;
            beforeEach(function() {
                actual = subject.distanceBetween("Target", "Target");
            });

            it('should return the expected distance', function() {
                expect(actual).to.be.equal(0);
            });
        });

        context('when the word is close match', function() {
            var actual;
            beforeEach(function() {
                actual = subject.distanceBetween("Targeys", "Target");
            });

            it('should return the expected distance', function() {
                expect(actual).to.be.equal(2);
            });
        });

        context('when the word is not match', function() {
            var actual;
            beforeEach(function() {
                actual = subject.distanceBetween("zzzzzz", "Target");
            });

            it('should return the expected distance', function() {
                expect(actual).to.be.equal(6);
            });
        });
        context('when there is source', function() {
            var actual;
            beforeEach(function() {
                actual = subject.distanceBetween("", "Target");
            });

            it('should return the expected distance', function() {
                expect(actual).to.be.equal(6);
            });
        });
        context('when there is target', function() {
            var actual;
            beforeEach(function() {
                actual = subject.distanceBetween("Target", "");
            });

            it('should return the expected distance', function() {
                expect(actual).to.be.equal(6);
            });
        });
    });

    describe('match', function() {
        var listOfObjects,
            stringToMatch,
            actual;
        context('when there is an exact match', function() {
            beforeEach(function() {
                listOfObjects = [{
                  name: 'some-string'
                }, {
                  name: 'another-string'
                }, {
                  name: 'someother-string'
                }, {
                  name: 'string'
                }];
                actual = subject.match(listOfObjects, 'name', 'string');
            });

            it('should return the expected string', function() {
                expect(actual).to.be.equal('string');
            });
        });

        context('when there is a close match', function() {
            beforeEach(function() {
                listOfObjects = [{
                  name: 'some-string'
                }, {
                  name: 'another-string'
                }, {
                  name: 'someother-string'
                }, {
                  name: 'strings'
                }];
                actual = subject.match(listOfObjects, 'name', 'string');
            });

            it('should return the expected string', function() {
                expect(actual).to.be.equal('strings');
            });
        });
        context('when there is a similar match', function() {
            beforeEach(function() {
                listOfObjects = ['some-string', 'another-string', 'someother-string']
                listOfObjects = [{
                  name: 'some-string'
                }, {
                  name: 'another-string'
                }, {
                  name: 'someother-string'
                }];
                actual = subject.match(listOfObjects, 'name', 'string');
            });

            it('should return the expected string', function() {
                expect(actual).to.be.equal('some-string');
            });
        });

        context('when there is not a good match', function() {
            beforeEach(function() {
                listOfObjects = [{
                  name: 'some'
                }, {
                  name: 'another'
                }, {
                  name: 'someother'
                }];
                actual = subject.match(listOfObjects, 'name', 'string');
            });

            it('should return the expected string', function() {
                expect(actual).to.be.equal('some');
            });
        });
    });
});
