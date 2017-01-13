var expect = require('chai').expect;
var sinon = require('sinon');

describe('RestManager.js', function() {
    var subject,
        requestStub,
        clientRequestMock,
        writeStub,
        endStub;
    beforeEach(function() {
        delete require.cache[require.resolve('../src/RestManager')];
        process.env.USER_AGENT = 'some-user-agent';
        subject = require('../src/RestManager');
        requestStub = sinon.stub(binder.objectGraph['https'], 'request');
        writeStub = sinon.stub();
        endStub = sinon.stub();

        clientRequestMock = {
            write: writeStub,
            end: endStub
        };
        requestStub.returns(clientRequestMock);
    });
    afterEach(function() {
        requestStub.restore();
    });

    describe('makeRequest', function() {
        context('when request is post', function() {
            var data,
                dataString,
                expectedOptions,
                success,
                error;
            beforeEach(function() {
                data = {
                    someKey: "some-value"
                };
                dataString = JSON.stringify(data);
                expectedOptions = {
                    hostname: 'api.github.com',
                    port: 443,
                    path: 'some-path?access_token=some-token',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'some-user-agent'
                    }
                };
                success = sinon.stub();
                error = sinon.stub();
                subject.makeRequest('POST', 'some-path', data, 'some-token', success, error);
            });


            it('should create a request object', function() {
                expect(requestStub.called).to.be.ok;
                expect(requestStub.getCall(0).args[0].hostname).to.be.equal(expectedOptions.hostname);
                expect(requestStub.getCall(0).args[0].port).to.be.equal(expectedOptions.port);
                expect(requestStub.getCall(0).args[0].path).to.be.equal(expectedOptions.path);
                expect(requestStub.getCall(0).args[0].method).to.be.equal(expectedOptions.method);
                expect(requestStub.getCall(0).args[0].headers['Content-Type']).to.be.equal(expectedOptions.headers['Content-Type']);
                expect(requestStub.getCall(0).args[0].headers['User-Agent']).to.be.equal(expectedOptions.headers['User-Agent']);
            });

            it('should call write with correct parameters', function() {
                expect(writeStub.called).to.be.ok;
                expect(writeStub.getCall(0).args[0]).to.be.equal(dataString);
            });

            it('should call end', function() {
                expect(endStub.called).to.be.ok;
            });

            describe('request callback', function() {
                var responseMock,
                    setEncodingStub,
                    onStub;
                context('when successful response', function() {
                    beforeEach(function() {
                        setEncodingStub = sinon.stub();
                        onStub = sinon.stub();
                        responseMock = {
                            statusCode: 200,
                            setEncoding: setEncodingStub,
                            on: onStub
                        };
                        requestStub.getCall(0).args[1](responseMock);
                    });

                    it('should set the encoding', function() {
                        expect(setEncodingStub.called).to.be.ok;
                        expect(setEncodingStub.getCall(0).args[0]).to.be.equal('utf8');
                    });

                    it('should set the on data listener', function() {
                        expect(onStub.called).to.be.ok;
                        expect(onStub.getCall(0).args[0]).to.be.equal('data');
                        expect(typeof onStub.getCall(0).args[1]).to.be.equal('function');
                    });

                    it('should set the on end listener', function() {
                        expect(onStub.called).to.be.ok;
                        expect(onStub.getCall(1).args[0]).to.be.equal('end');
                        expect(typeof onStub.getCall(1).args[1]).to.be.equal('function');
                    });

                    describe('on data callback', function() {
                        beforeEach(function() {
                            onStub.getCall(0).args[1]("some-data");
                        });
                        it('should set append the data chuck to the body', function() {
                            expect(responseMock.body).to.be.equal("some-data");
                        });
                    });


                    describe('on end callback', function() {
                        beforeEach(function() {
                            responseMock.body = JSON.stringify({
                                some: 'data'
                            });
                            onStub.getCall(1).args[1]();
                        });
                        it('should call the success callback', function() {
                            expect(success.called).to.be.ok;
                        });
                    });
                });
                context('when unsuccessful response', function() {
                    beforeEach(function() {
                        setEncodingStub = sinon.stub();
                        onStub = sinon.stub();
                        responseMock = {
                            statusCode: 500,
                            setEncoding: setEncodingStub,
                            on: onStub
                        }
                        requestStub.getCall(0).args[1](responseMock);
                    });

                    it('should set the encoding', function() {
                        expect(setEncodingStub.called).to.be.ok;
                        expect(setEncodingStub.getCall(0).args[0]).to.be.equal('utf8');
                    });

                    it('should set the on data listener', function() {
                        expect(onStub.called).to.be.ok;
                        expect(onStub.getCall(0).args[0]).to.be.equal('data');
                        expect(typeof onStub.getCall(0).args[1]).to.be.equal('function');
                    });

                    it('should set the on end listener', function() {
                        expect(onStub.called).to.be.ok;
                        expect(onStub.getCall(1).args[0]).to.be.equal('end');
                        expect(typeof onStub.getCall(1).args[1]).to.be.equal('function');
                    });

                    describe('on data callback', function() {
                        beforeEach(function() {
                            onStub.getCall(0).args[1]("some-data");
                        });
                        it('should set append the data chuck to the body', function() {
                            expect(responseMock.body).to.be.equal("some-data");
                        });
                    });

                    describe('on end callback', function() {
                        beforeEach(function() {
                            responseMock.body = JSON.stringify({
                                some: 'data'
                            });
                            onStub.getCall(1).args[1]();
                        });
                        it('should call the error callback', function() {
                            expect(error.called).to.be.ok;
                            expect(error.getCall(0).args[0].some).to.be.equal('data');
                            expect(error.getCall(0).args[1]).to.be.equal(500);
                        });
                    });
                });
            });
        });
        context('when the request is get', function() {
            var data,
                dataString,
                expectedOptions,
                success,
                error;
            beforeEach(function() {
                data = {
                    someKey: "some-value"
                };
                dataString = JSON.stringify(data);
                expectedOptions = {
                    hostname: 'api.github.com',
                    port: 443,
                    path: 'some-path?someKey=some-value&access_token=some-token',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'some-user-agent'
                    }
                };
                success = sinon.stub();
                error = sinon.stub();
                subject.makeRequest('GET', 'some-path', data, 'some-token', success, error);
            });

            it('should create a request object', function() {
                expect(requestStub.called).to.be.ok;
                expect(requestStub.getCall(0).args[0].hostname).to.be.equal(expectedOptions.hostname);
                expect(requestStub.getCall(0).args[0].port).to.be.equal(expectedOptions.port);
                expect(requestStub.getCall(0).args[0].path).to.be.equal(expectedOptions.path);
                expect(requestStub.getCall(0).args[0].method).to.be.equal(expectedOptions.method);
                expect(requestStub.getCall(0).args[0].headers['Content-Type']).to.be.equal(expectedOptions.headers['Content-Type']);
                expect(requestStub.getCall(0).args[0].headers['User-Agent']).to.be.equal(expectedOptions.headers['User-Agent']);
            });

            it('should not call write', function() {
                expect(writeStub.called).to.not.be.ok;
            });

            it('should call end', function() {
                expect(endStub.called).to.be.ok;
            });
        });
    });
});
