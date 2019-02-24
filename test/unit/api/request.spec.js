const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { Errors, Document } = require('../../../');
const { NotImplementedError } = Errors;

chai.use(require('sinon-chai'));

describe('api/request', function () {
  let requestLib;
  let requestHelpers;
  let request;

  beforeEach(function () {
    requestLib = sinon.stub().resolves(JSON.stringify({ id: '25OR624' }));
    requestHelpers = {
      getAuthorization: sinon.stub().returnsArg(0),
      getRoute: sinon.stub().callsFake(({ route }) => `http://your.api.here${route}`),
      documentsToMultipart: sinon.stub().returnsArg(0),
      dataToMultipart: sinon.stub().returnsArg(0)
    };
    request = proxyquire('../../../lib/api/request', {
      'request-promise-native': requestLib,
      './helpers/request': requestHelpers
    });
  });

  describe('oneSpanRequest()', function () {
    it('should throw a NotImplementedError', function () {
      expect(() => request.oneSpanRequest({})).to.throw(NotImplementedError);
    });
  });

  describe('oneSpanMultipartFormDataRequest()', function () {
    let requestPayload;

    beforeEach(function () {
      request.oneSpanMultipartFormDataRequest({
        method: 'POST',
        route: '/red/green/blue',
        documents: [
          new Document({
            name: 'Koolaid',
            file: 'koolaid.pdf'
          })
        ],
        data: {
          name: 'Koolaid Contract'
        },
        apiKey: '62222HG',
        sandbox: false
      });
      requestPayload = requestLib.args[0][0];
    });

    it('should call request', function () {
      expect(requestLib).to.have.been.calledOnce;
      expect(requestPayload.method).to.equal('POST');
    });

    it('should call getAuthorization with the apiKey to set the Authorization within the request header', function () {
      expect(requestHelpers.getAuthorization).to.have.been.calledOnce;
      expect(requestHelpers.getAuthorization).to.have.been.calledWith('62222HG');
      expect(requestPayload.headers.Authorization).to.equal('62222HG');
    });

    it('should call getRoute with the route and sandbox to set the uri within the request', function () {
      expect(requestHelpers.getRoute).to.have.been.calledOnce;
      expect(requestHelpers.getRoute).to.have.been.calledWith({
        route: '/red/green/blue',
        sandbox: false
      });
      expect(requestPayload.uri).to.equal('http://your.api.here/red/green/blue');
    });

    it('should call documentsToMultipart with the documents to set the multipart elements in the request', function () {
      const document = new Document({
        name: 'Koolaid',
        file: 'koolaid.pdf'
      });
      expect(requestHelpers.documentsToMultipart).to.have.been.calledOnce;
      expect(requestHelpers.documentsToMultipart).to.have.been.calledWith([document]);
    });

    it('should call dataToMultipart with the data to set the multipart elements in the request', function () {
      expect(requestHelpers.dataToMultipart).to.have.been.calledOnce;
      expect(requestHelpers.dataToMultipart).to.have.been.calledWith({
        name: 'Koolaid Contract'
      });
    });

    it('should return the parsed response of request', async function () {
      const response = await request.oneSpanMultipartFormDataRequest({
        method: 'POST',
        route: '/red/green/blue',
        documents: [
          new Document({
            name: 'Koolaid',
            file: 'koolaid.pdf'
          })
        ],
        data: {
          name: 'Koolaid Contract'
        },
        apiKey: '62222HG',
        sandbox: false
      });
      expect(response).to.eql({ id: '25OR624' });
    });
  });

  describe('oneSpanPDFRequest()', function () {
    it('should throw a NotImplementedError', function () {
      expect(() => request.oneSpanPDFRequest({})).to.throw(NotImplementedError);
    });
  });
});
