var expect = require('chai').expect;
var sinon = require('sinon');

describe('SpaceConverter.js', function() {
    var subject;
    beforeEach(function() {
        subject = require('../src/SpaceConverter');
    });
    describe('convertSpacesToDashes', function() {
        var actual,
            text;
        beforeEach(function() {
            text = "some stuff needs to be converted";
            actual = subject.convertSpacesToDashes(text);
        });

        it('should return the expected value', function() {
            expect(actual).to.be.equal('some-stuff-needs-to-be-converted');
        });
    });
});
