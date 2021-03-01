const chai = require("chai");
const { expect } = chai;
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { PACKAGES, DOCUMENTS } = require("../../lib/api/one-span");
const { Errors, Document, Field, Signer } = require("../../");
const { InitializationError, NotImplementedError } = Errors;

chai.use(require("sinon-chai"));

describe("client", function () {
  let sandbox;
  let Client;
  let client;
  let assemblePackage;
  let oneSpanRequest;
  let oneSpanMultipartFormDataRequest;
  let oneSpanPDFRequest;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    assemblePackage = sandbox.stub().returnsArg(0);
    oneSpanRequest = sandbox.stub().resolves({ id: "25OR624-CC" });
    oneSpanMultipartFormDataRequest = sandbox
      .stub()
      .resolves({ id: "25OR625" });
    oneSpanPDFRequest = sandbox
      .stub()
      .resolves(Buffer.from("25OR625-pkg-data"));
    Client = proxyquire("../../lib/client", {
      "./api/request": {
        oneSpanRequest,
        oneSpanMultipartFormDataRequest,
        oneSpanPDFRequest,
      },
      "./api/package": assemblePackage,
    });

    client = new Client({
      apiKey: "25OR624",
      sandbox: true,
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe("constructor()", function () {
    it("should throw an error if constructed without an apiKey", function () {
      expect(() => new Client({})).to.throw(InitializationError);
    });

    it("should throw an error if the domain property is not a string", function () {
      expect(() => new Client({ apiKey: "25OR624", domain: 55 })).to.throw(
        InitializationError
      );
    });

    it("should throw an error if the domain property is empty", function () {
      expect(() => new Client({ apiKey: "25OR624", domain: "" })).to.throw(
        InitializationError
      );
    });

    it("should throw an error if the sandboxDomain property is not a string, in sandbox mode", function () {
      expect(
        () =>
          new Client({ apiKey: "25OR624", sandbox: true, sandboxDomain: {} })
      ).to.throw(InitializationError);
    });

    it("should throw an error if the sandboxDomain property is empty, in sandbox mode", function () {
      expect(
        () =>
          new Client({ apiKey: "25OR624", sandbox: true, sandboxDomain: "" })
      ).to.throw(InitializationError);
    });

    it("should set the apiKey property on the instance", function () {
      expect(client.apiKey).to.equal("25OR624");
    });

    it("should set the sandbox property on the instance if passed sandbox in the constructor", function () {
      expect(client.sandbox).to.be.true;
    });

    it("should set the domain property on the instance", function () {
      const myClient = new Client({
        apiKey: "25OR624",
        domain: "production.domain",
      });
      expect(myClient.domain).to.equal("production.domain");
    });

    it("should set the sandboxDomain property on the instance", function () {
      const myClient = new Client({
        apiKey: "25OR624",
        sandbox: true,
        sandboxDomain: "sandbox.domain",
      });
      expect(myClient.sandboxDomain).to.equal("sandbox.domain");
    });

    it("should set the domain property on the instance to apps.esignlive.com by default", function () {
      expect(client.domain).to.equal("apps.esignlive.com");
    });

    it("should set the domain property on the instance to sandbox.esignlive.com", function () {
      expect(client.sandboxDomain).to.equal("sandbox.esignlive.com");
    });
  });

  describe("getPackage()", function () {
    it("should call oneSpanRequest()", function () {
      client.getPackage("25OR624-CC");
      expect(oneSpanRequest).to.have.been.calledOnce;
      expect(oneSpanRequest).to.have.been.calledWith({
        method: "GET",
        route: "/packages/25OR624-CC",
        apiKey: "25OR624",
        sandbox: true,
        domain: "apps.esignlive.com",
        sandboxDomain: "sandbox.esignlive.com",
      });
    });

    it("should return a promise that resolves from the result of oneSpanRequest()", async function () {
      const response = await client.getPackage("25OR624-CC");
      expect(response).to.eql({ id: "25OR624-CC" });
    });
  });

  describe("getPackages()", function () {
    it("should call oneSpanRequest() with the default query {from: 0, to: 100}", function () {
      client.getPackages();
      expect(oneSpanRequest).to.have.been.calledOnce;
      expect(oneSpanRequest).to.have.been.calledWith({
        method: "GET",
        route: "/packages",
        query: {
          from: 0,
          to: 100,
        },
        apiKey: "25OR624",
        sandbox: true,
        domain: "apps.esignlive.com",
        sandboxDomain: "sandbox.esignlive.com",
      });
    });

    it("should be able to pass a query down to the oneSpanRequest()", function () {
      client.getPackages({
        red: 17,
        green: true,
        blue: "hello",
      });
      expect(oneSpanRequest).to.have.been.calledOnce;
      expect(oneSpanRequest).to.have.been.calledWith({
        method: "GET",
        route: "/packages",
        query: {
          red: 17,
          green: true,
          blue: "hello",
        },
        apiKey: "25OR624",
        sandbox: true,
        domain: "apps.esignlive.com",
        sandboxDomain: "sandbox.esignlive.com",
      });
    });

    it("should return a promise that resolves from the result of oneSpanRequest()", async function () {
      const response = await client.getPackages("25OR624-CC");
      expect(response).to.eql({ id: "25OR624-CC" });
    });
  });

  describe("getPackageSigningUrl()", function () {
    it("should call oneSpanRequest()", function () {
      client.getPackageSigningUrl("=679278", "Sous-chef");
      expect(oneSpanRequest).to.have.been.calledOnce;
      expect(oneSpanRequest).to.have.been.calledWith({
        method: "GET",
        route: "/packages/=679278/roles/Sous-chef/signingUrl",
        apiKey: "25OR624",
        sandbox: true,
        domain: "apps.esignlive.com",
        sandboxDomain: "sandbox.esignlive.com",
      });
    });

    it("should play nice with role provided in a Signer instance", function () {
      client.getPackageSigningUrl("=679278", new Signer({ role: "Head-chef" }));
      expect(oneSpanRequest).to.have.been.calledOnce;
      expect(oneSpanRequest).to.have.been.calledWith({
        method: "GET",
        route: "/packages/=679278/roles/Head-chef/signingUrl",
        apiKey: "25OR624",
        sandbox: true,
        domain: "apps.esignlive.com",
        sandboxDomain: "sandbox.esignlive.com",
      });
    });

    it("should return a promise that resolves from the result of oneSpanRequest()", async function () {
      const response = await client.getPackageSigningUrl(
        "=679278",
        "Sous-chef"
      );
      expect(response).to.eql({ id: "25OR624-CC" });
    });
  });

  describe("getPackageSigningStatus()", function () {
    it("should throw a NotImplementedError", function () {
      expect(() => client.getPackageSigningStatus()).to.throw(
        NotImplementedError
      );
    });
  });

  describe("createPackage()", function () {
    it("should call oneSpanMultipartFormDataRequest()", async function () {
      const document = new Document({
        name: "Income Tax Form",
        file: "path/to/my/income/tax/form.pdf",
        signatureFields: [
          new Field({
            name: "sigPrep",
            role: "Cheese",
            template: { subtype: "CAPTURE" },
          }),
          new Field({
            name: "f1-66",
            role: "Crackers",
            template: { subtype: "CAPTURE" },
          }),
        ],
      });
      const signers = [
        new Signer({
          role: "Cheese",
          firstName: "Rollo",
          lastName: "Sly",
          email: "rollosly@hotmail.com",
        }),
        new Signer({
          role: "Crackers",
          firstName: "Mitch",
          lastName: "Kooly",
          email: "mitchkooly@lycos.com",
        }),
      ];
      await client.createPackage(
        "Income Tax A",
        "File path version of test",
        document,
        signers
      );
      expect(oneSpanMultipartFormDataRequest).to.have.been.calledOnce;
      expect(oneSpanMultipartFormDataRequest).to.have.been.calledWith({
        method: "POST",
        route: PACKAGES.ROUTE,
        documents: [document],
        data: {
          name: "Income Tax A",
          description: "File path version of test",
          documents: [document],
          signers,
        },
        apiKey: "25OR624",
        sandbox: true,
        domain: "apps.esignlive.com",
        sandboxDomain: "sandbox.esignlive.com",
      });
    });

    it("should return a promise that resolves from the result of oneSpanMultipartFormDataRequest()", async function () {
      const document = new Document({
        name: "Income Tax Form",
        file: "path/to/my/income/tax/form.pdf",
        signatureFields: [
          new Field({
            name: "sigPrep",
            role: "Cheese",
            template: { subtype: "CAPTURE" },
          }),
          new Field({
            name: "f1-66",
            role: "Crackers",
            template: { subtype: "CAPTURE" },
          }),
        ],
      });
      const signers = [
        new Signer({
          role: "Cheese",
          firstName: "Rollo",
          lastName: "Sly",
          email: "rollosly@hotmail.com",
        }),
        new Signer({
          role: "Crackers",
          firstName: "Mitch",
          lastName: "Kooly",
          email: "mitchkooly@lycos.com",
        }),
      ];
      const response = await client.createPackage(
        "Income Tax A",
        "File path version of test",
        document,
        signers
      );
      expect(response).to.eql({ id: "25OR625" });
    });
  });

  describe("updatePackage()", function () {
    it("should call oneSpanMultipartFormDataRequest()", async function () {
      const packageId = '2240'
      const body = {
        status: PACKAGES.STATUS.DRAFT,
      };
      await client.updatePackage(
        packageId,
        body
      );
      expect(oneSpanRequest).to.have.been.calledOnce;
      expect(oneSpanRequest).to.have.been.calledWith({
        apiKey: "25OR624",
        domain: "apps.esignlive.com",
        method: "PUT",
        route: "/packages/2240",
        sandbox: true,
        sandboxDomain: "sandbox.esignlive.com",
        body,
      });
    });

    it("should return a promise that resolves from the result of oneSpanMultipartFormDataRequest()", async function () {
      const packageId = "2240";
      const body = {
        status: PACKAGES.STATUS.DRAFT,
      };
      const response = await client.updatePackage(packageId, body);
      expect(response).to.eql({ id: "25OR624-CC" });
    });
  });

  describe("deletePackage()", function () {
    it("should throw a NotImplementedError", function () {
      expect(() => client.deletePackage()).to.throw(NotImplementedError);
    });
  });

  describe("clonePackage()", function () {
    it("should throw a NotImplementedError", function () {
      expect(() => client.clonePackage()).to.throw(NotImplementedError);
    });
  });

  describe("getDocument()", function () {
    it("should call oneSpanPDFRequest()", function () {
      client.getDocument("25OR625", "25OR625-pkg");
      expect(oneSpanPDFRequest).to.have.been.calledOnce;
      expect(oneSpanPDFRequest).to.have.been.calledWith({
        method: "GET",
        route: `${PACKAGES.ROUTE}/25OR625${DOCUMENTS.ROUTE}/25OR625-pkg/pdf`,
        query: {
          flatten: true,
        },
        apiKey: "25OR624",
        sandbox: true,
        domain: "apps.esignlive.com",
        sandboxDomain: "sandbox.esignlive.com",
      });
    });

    it("should return a promise that resolves from the result of oneSpanPDFRequest()", async function () {
      const response = await client.getDocument("25OR625", "25OR625-pkg");
      expect(response).to.eql(Buffer.from("25OR625-pkg-data"));
    });
  });
});
