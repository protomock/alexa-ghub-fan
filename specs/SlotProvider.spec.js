var expect = require('chai').expect;
var sinon = require('sinon');

describe('SlotProvider.js', function() {
    var subject,
        intent;
    beforeEach(function() {
        intent = {
            slots: {
                RepositoryName: {},
                Privacy: {}
            }
        };
        subject = require('../src/SlotProvider');
    });
    describe('provideCreateRepositorySlots', function() {
        context('when the slots are provided and have a value', function() {
            var actual;
            beforeEach(function() {
                intent.slots.RepositoryName = {
                    name: 'Some-name',
                    value: 'some-value'
                };
                intent.slots.Privacy = {
                    name: 'Some-name-2',
                    value: 'some-value-2'
                };
                actual = subject.provideCreateRepositorySlots(intent);
            });
            it('should return the expected value', function() {
                expect(actual.RepositoryName.name).to.be.equal('Some-name');
                expect(actual.RepositoryName.value).to.be.equal('some-value');
                expect(actual.Privacy.name).to.be.equal('Some-name-2');
                expect(actual.Privacy.value).to.be.equal('some-value-2');
            });

        });
        context('when the RepositoryName Slot are not provided', function() {
            var actual;
            beforeEach(function() {
                actual = subject.provideCreateRepositorySlots(intent);
            });
            it('should return the expected error value', function() {
                expect(actual.error).to.be.ok;
            });
        });
    });

    describe('provideLatestCommitSlots', function() {
        context('when the slots are provided and have a value', function() {
            var actual,
                convertSpacesToDashesStub;
            beforeEach(function() {
                intent.slots.RepositoryName = {
                    name: 'Some-name',
                    value: 'some value'
                };
                convertSpacesToDashesStub = sinon.stub(binder.objectGraph['SpaceConverter'], 'convertSpacesToDashes');
                convertSpacesToDashesStub.returns('some-value');
                actual = subject.provideLatestCommitSlots(intent);
            });
            it('should return the expected value', function() {
                expect(actual.name).to.be.equal('Some-name');
                expect(actual.value).to.be.equal('some-value');
            });
            afterEach(function() {
                convertSpacesToDashesStub.restore();
            });
        });
        context('when the slots are not provided', function() {
            var actual;
            beforeEach(function() {
                actual = subject.provideLatestCommitSlots(intent);
            });
            it('should return the expected value', function() {
                expect(actual.error).to.be.ok;
            });
        });
    });
});
