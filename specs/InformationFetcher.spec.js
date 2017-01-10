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
            successCallBackStub;
        beforeEach(function() {
            getMyInfoStub = sinon.stub(binder.objectGraph['GitHubClient'], 'getMyInfo');
            sessionMock = {
                user: {
                    accessToken: 'some-token'
                },
                attributes: {}
            };
            successCallBackStub = sinon.stub();
            subject.getUserInformation(sessionMock, successCallBackStub, 'error');
        });

        afterEach(function() {
           getMyInfoStub.restore();
        });


        it('should call getMyInfoStub with the correct parameters', function() {
            expect(getMyInfoStub.called).to.be.ok;
            expect(getMyInfoStub.getCall(0).args[0]).to.be.equal('some-token');
            expect(typeof getMyInfoStub.getCall(0).args[1]).to.be.equal('function');
            expect(getMyInfoStub.getCall(0).args[2]).to.be.equal('error');
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
