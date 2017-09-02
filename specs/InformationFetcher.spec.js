/* global describe beforeEach afterEach it context  */
var expect = require('chai').expect
var sinon = require('sinon')
var mockInjector = require('mock-injector')(__dirname)
var gitHubClientFactory = require('../src/GitHubClientFactory')

describe('InformationFetcher', function () {
  var subject,
    createInstanceStub
  beforeEach(function () {
    createInstanceStub = sinon.stub(gitHubClientFactory, 'createInstance')
    mockInjector.inject('../src/GitHubClientFactory', gitHubClientFactory)
    subject = mockInjector.subject('../src/InformationFetcher')
  })

  afterEach(function () {
    createInstanceStub.restore()
  })

  describe('getUserInformation', function () {
    var getMyInfoStub,
      sessionMock,
      successCallBackStub,
      responseMock,
      gitHubClientMock
    beforeEach(function () {
      getMyInfoStub = sinon.stub()

      gitHubClientMock = {
        getMyInfo: getMyInfoStub
      }
      createInstanceStub.returns(gitHubClientMock)

      responseMock = {}

      sessionMock = {
        user: {
          accessToken: 'some-token'
        },
        attributes: {}
      }
      successCallBackStub = sinon.stub()
      subject.getUserInformation(sessionMock, responseMock, successCallBackStub)
    })

    it('should call getMyInfoStub with the correct parameters', function () {
      expect(getMyInfoStub.called).to.be.ok
      expect(getMyInfoStub.getCall(0).args[0]).to.be.equal('some-token')
      expect(typeof getMyInfoStub.getCall(0).args[1]).to.be.equal('function')
    })

    describe('onSuccess', function () {
      var data
      beforeEach(function () {
        data = {
          login: 'some-login',
          name: 'some name'
        }
        getMyInfoStub.getCall(0).args[1](data)
      })
      it('should set the session attribute for owner', function () {
        expect(sessionMock.attributes['owner']).to.be.equal('some-login')
      })
      it('should set the session attribute for name', function () {
        expect(sessionMock.attributes['name']).to.be.equal('some')
      })
      it('should set the session attribute for owner', function () {
        expect(successCallBackStub.called).to.be.ok
        expect(successCallBackStub.getCall(0).args[0]).to.be.equal(sessionMock)
      })

      context('when data.name is not populated', function () {
        beforeEach(function () {
          data = {
            login: 'some-login',
            name: null
          }
          getMyInfoStub.getCall(0).args[1](data)
        })
        it('should set the session attribute for name', function () {
          expect(sessionMock.attributes['name']).to.not.be.ok
        })
      })

      context('when data.name is populated with empty string', function () {
        beforeEach(function () {
          data = {
            login: 'some-login',
            name: ''
          }
          getMyInfoStub.getCall(0).args[1](data)
        })
        it('should set the session attribute for name', function () {
          expect(sessionMock.attributes['name']).to.not.be.ok
        })
      })
    })
  })
})
