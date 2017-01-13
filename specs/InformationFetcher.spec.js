var expect = require('chai').expect;
var sinon = require('sinon');

describe('InformationFetcher', function() {
    var subject;
    beforeEach(function() {
        subject = require('../src/InformationFetcher');
    });

    describe('getUserInformation', function() {
        var getMyInfoStub,
            sessionMock,
            successCallBackStub,
            responseMock;
        beforeEach(function() {
            getMyInfoStub = sinon.stub();

            gitHubClientMock = {
                getMyInfo: getMyInfoStub,
            };
            createInstanceStub = sinon.stub(binder.objectGraph['GitHubClientFactory'], 'createInstance');
            createInstanceStub.returns(gitHubClientMock);

            responseMock = {};

            sessionMock = {
                user: {
                    accessToken: 'some-token'
                },
                attributes: {}
            };
            successCallBackStub = sinon.stub();
            subject.getUserInformation(sessionMock, responseMock, successCallBackStub);
        });

        afterEach(function() {
            createInstanceStub.restore();
        });


        it('should call getMyInfoStub with the correct parameters', function() {
            expect(getMyInfoStub.called).to.be.ok;
            expect(getMyInfoStub.getCall(0).args[0]).to.be.equal('some-token');
            expect(typeof getMyInfoStub.getCall(0).args[1]).to.be.equal('function');
        });

        describe('onSuccess', function() {
            var data;
            beforeEach(function() {
                data = {
                    login: 'some-login'
                };
                getMyInfoStub.getCall(0).args[1](data);
            });
            it('should set the session attribute for owner', function() {
                expect(sessionMock.attributes['owner']).to.be.equal('some-login');
            });
            it('should set the session attribute for owner', function() {
                expect(successCallBackStub.called).to.be.ok;
                expect(successCallBackStub.getCall(0).args[0]).to.be.equal(sessionMock);
            });
        });
    });
});
