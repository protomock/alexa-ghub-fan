var expect = require('chai').expect;
var sinon = require('sinon');

describe('SSMLResponder.js', function() {
    var subject,
        responseMock,
        tellStub;
    beforeEach(function() {
        tellStub = sinon.stub();
        responseMock = {
            tell: tellStub
        }
        subject = require('../src/SSMLResponder');
    });

    describe('promptListOfRepositoriesResponse', function() {
        var listOfRepositories,
            expected;
        beforeEach(function() {
            expected = {
                speech: "<speak>" +
                    "<s>Here are your repos:</s>" +
                    "<s>some-name which is private to you.</s>" +
                    "<s>some-name-2</s>" +
                    "</speak>",
                type: "SSML"
            };
            listOfRepositories = [{
                name: "some-name",
                private: true
            }, {
                name: "some-name-2",
                private: false
            }];
            subject.promptListOfRepositoriesResponse(listOfRepositories, responseMock)
        });
        it('should call tell with the correct ssml', function() {
            expect(tellStub.called).to.be.ok;
            expect(tellStub.getCall(0).args[0].speech).to.be.equal(expected.speech);
            expect(tellStub.getCall(0).args[0].type).to.be.equal(expected.type);
        });
    });
    describe('promptListOfIssuesResponse', function() {
        var listOfIssues,
            expected;
        context('when the user has issues', function() {
            beforeEach(function() {
                expected = {
                    speech: "<speak>" +
                        "<s>Here are the issues that are assigned to you and open:</s>" +
                        "<s>some-title that was labeled a bug.</s>" +
                        "<s>some-title-2</s>" +
                        "</speak>",
                    type: "SSML"
                };
                listOfIssues = [{
                    title: "some-title",
                    labels: [{
                        name: "bug"
                    }]
                }, {
                    title: "some-title-2",
                }];
                subject.promptListOfIssuesResponse(listOfIssues, responseMock)
            });
            it('should call tell with the correct ssml', function() {
                expect(tellStub.called).to.be.ok;
                expect(tellStub.getCall(0).args[0].speech).to.be.equal(expected.speech);
                expect(tellStub.getCall(0).args[0].type).to.be.equal(expected.type);
            });
        });
        context('when the user does not have issues', function() {
            beforeEach(function() {
                expected = {
                    speech: "<speak>" +
                        "<s>There is currently no open issues assigned to you.</s>" +
                        "</speak>",
                    type: "SSML"
                };
                listOfIssues = [];
                subject.promptListOfIssuesResponse(listOfIssues, responseMock);
            });
            it('should call tell with the correct ssml', function() {
                expect(tellStub.called).to.be.ok;
                expect(tellStub.getCall(0).args[0].speech).to.be.equal(expected.speech);
                expect(tellStub.getCall(0).args[0].type).to.be.equal(expected.type);
            });
        });
    });
});
