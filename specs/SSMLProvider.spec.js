var expect = require('chai').expect;
var sinon = require('sinon');

describe('SSMLProvider.js', function() {
    var subject;
    beforeEach(function() {
        subject = require('../src/SSMLProvider');
    });

    describe('provideListOfRepositoriesSSML', function() {
        var listOfRepositories,
            actual,
            expected;
        beforeEach(function() {
            expected = "<speak>" +
                "<s>Here are your repos:</s>" +
                "<s>some-name which is private to you.</s>" +
                "<s>some-name-2</s>" +
                "</speak>";
            listOfRepositories = [{
                name: "some-name",
                private: true
            }, {
                name: "some-name-2",
                private: false
            }];
            actual = subject.provideListOfRepositoriesSSML(listOfRepositories)
        });
        it('should create the correct ssml', function() {
            expect(actual).to.be.equal(expected);
        });
    });
    describe('provideListOfIssuesSSML', function() {
        var listOfIssues,
            actual,
            expected;
        context('when the user has issues', function() {
            beforeEach(function() {
                expected = "<speak>" +
                    "<s>Here are the issues that are assigned to you and open:</s>" +
                    "<s>some-title that was labeled a bug.</s>" +
                    "<s>some-title-2</s>" +
                    "</speak>";
                listOfIssues = [{
                    title: "some-title",
                    labels: [{
                        name: "bug"
                    }]
                }, {
                    title: "some-title-2",
                }];
                actual = subject.provideListOfIssuesSSML(listOfIssues)
            });
            it('should create the correct ssml', function() {
                expect(actual).to.be.equal(expected);
            });
        });
        context('when the user does not have issues', function() {
            beforeEach(function() {
                expected = "<speak>" +
                    "<s>There is currently no open issues assigned to you.</s>" +
                    "</speak>";
                listOfIssues = [];
                actual = subject.provideListOfIssuesSSML(listOfIssues)
            });
            it('should create the correct ssml', function() {
                expect(actual).to.be.equal(expected);
            });
        });
    });
});
