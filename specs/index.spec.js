var expect = require('chai').expect;
var sinon = require('sinon');

describe('index.js', function(){
    var subject;
    beforeEach(function(){
        subject = require('../src/index');
    });

    it('should setup the handler for responding to the alexa request', function(){
        expect(typeof subject.handler).to.be.equal('function');
    });

    describe('handler', function(){
        var gitHubHelperMock,
            executeStub,
            gitHubHelperFactoryMock,
            createInstanceStub;

        beforeEach(function(){
            executeStub = sinon.stub();
            gitHubHelperMock = {
              execute: executeStub
            };
            createInstanceStub = sinon.stub();
            createInstanceStub.returns(gitHubHelperMock);
            gitHubHelperFactoryMock = {
              createInstance: createInstanceStub
            };
            binder.bind('GitHubHelperFactory',gitHubHelperFactoryMock);
            subject.handler('event', 'context');
        });
        it('should call get a new instance of GitHubHelper', function(){
            expect(createInstanceStub.called).to.be.ok;
        });
        it('should call execute with provided event and context', function(){
            expect(executeStub.called).to.be.ok;
            expect(executeStub.getCall(0).args[0]).to.be.equal('event');
            expect(executeStub.getCall(0).args[1]).to.be.equal('context');
        });
    });
});
