const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { PACKAGES } = require('../../lib/api/one-span');
const { Errors, Document, Field, Signer } = require('../../');
const { InitializationError, NotImplementedError } = Errors;
const request = require('../../lib/api/request');

chai.use(require('sinon-chai'));

describe('client', function () {
  let sandbox;
  let Client;
  let client;
  let assemblePackage;
  let oneSpanMultipartFormDataRequest;

  beforeEach(function () {
    sandbox = sinon.createSandbox();

    assemblePackage = sandbox.stub().returnsArg(0);
    oneSpanMultipartFormDataRequest = sandbox.stub().resolves({ id: '25OR625' });
    Client = proxyquire('../../lib/client', {
      './api/request': { oneSpanMultipartFormDataRequest },
      './api/package': assemblePackage
    });

    client = new Client({
      apiKey: '25OR624',
      sandbox: true
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should throw an error if constructed without an apiKey', function () {
    expect(() => new Client({})).to.throw(InitializationError);
  });

  it('should set the apiKey property on the instance', function () {
    expect(client.apiKey).to.equal('25OR624');
  });

  it('should set the sandbox property on the instance if passed sandbox in the constructor', function () {
    expect(client.sandbox).to.be.true;
  });

  describe('getPackage()', function () {
    it('should throw a NotImplementedError', function () {
      expect(() => client.getPackage()).to.throw(NotImplementedError);
    });
  });

  describe('getPackages()', function () {
    it('should throw a NotImplementedError', function () {
      expect(() => client.getPackages()).to.throw(NotImplementedError);
    });
  });

  describe('getPackageSigningUrl()', function () {
    it('should throw a NotImplementedError', function () {
      expect(() => client.getPackageSigningUrl()).to.throw(NotImplementedError);
    });
  });

  describe('getPackageSigningStatus()', function () {
    it('should throw a NotImplementedError', function () {
      expect(() => client.getPackageSigningStatus()).to.throw(NotImplementedError);
    });
  });

  describe('createPackage()', function () {
    it('should call oneSpanMultipartFormDataRequest()', async function () {
      const document = new Document({
        name: 'Income Tax Form',
        file: 'path/to/my/income/tax/form.pdf',
        signatureFields: [
          new Field({
            name: 'sigPrep',
            role: 'Cheese',
            template: { subtype: 'CAPTURE' }
          }),
          new Field({
            name: 'f1-66',
            role: 'Crackers',
            template: { subtype: 'CAPTURE' }
          })
        ]
      });
      const signers = [
        new Signer({
          role: 'Cheese',
          firstName: 'Rollo',
          lastName: 'Sly',
          email: 'rollosly@hotmail.com'
        }),
        new Signer({
          role: 'Crackers',
          firstName: 'Mitch',
          lastName: 'Kooly',
          email: 'mitchkooly@lycos.com'
        })
      ];
      await client.createPackage(
        'Income Tax A',
        'File path version of test',
        document,
        signers
      );
      expect(oneSpanMultipartFormDataRequest).to.have.been.calledOnce;
      expect(oneSpanMultipartFormDataRequest).to.have.been.calledWith({
        method: 'POST',
        route: PACKAGES.ROUTE,
        documents: [document],
        data: {
          name: 'Income Tax A',
          description: 'File path version of test',
          documents: [document],
          signers
        },
        apiKey: '25OR624',
        sandbox: true
      });
    });

    it('should return a promise that resolves from the result of oneSpanMultipartFormDataRequest()', async function () {
      const document = new Document({
        name: 'Income Tax Form',
        file: 'path/to/my/income/tax/form.pdf',
        signatureFields: [
          new Field({
            name: 'sigPrep',
            role: 'Cheese',
            template: { subtype: 'CAPTURE' }
          }),
          new Field({
            name: 'f1-66',
            role: 'Crackers',
            template: { subtype: 'CAPTURE' }
          })
        ]
      });
      const signers = [
        new Signer({
          role: 'Cheese',
          firstName: 'Rollo',
          lastName: 'Sly',
          email: 'rollosly@hotmail.com'
        }),
        new Signer({
          role: 'Crackers',
          firstName: 'Mitch',
          lastName: 'Kooly',
          email: 'mitchkooly@lycos.com'
        })
      ];
      const response = await client.createPackage(
        'Income Tax A',
        'File path version of test',
        document,
        signers
      );
      expect(response).to.eql({ id: '25OR625' });
    });
  });

  describe('updatePackage()', function () {
    it('should throw a NotImplementedError', function () {
      expect(() => client.updatePackage()).to.throw(NotImplementedError);
    });
  });

  describe('deletePackage()', function () {
    it('should throw a NotImplementedError', function () {
      expect(() => client.deletePackage()).to.throw(NotImplementedError);
    });
  });

  describe('clonePackage()', function () {
    it('should throw a NotImplementedError', function () {
      expect(() => client.clonePackage()).to.throw(NotImplementedError);
    });
  });

  describe('getDocument()', function () {
    it('should throw a NotImplementedError', function () {
      expect(() => client.getDocument()).to.throw(NotImplementedError);
    });
  });
});
