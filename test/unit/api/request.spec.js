const chai = require("chai");
const { expect } = chai;
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Document } = require("../../../");

chai.use(require("sinon-chai"));

describe("api/request", function () {
  let requestLib;
  let requestHelpers;
  let request;
  let requestPayload;

  beforeEach(function () {
    requestLib = sinon.stub().resolves(JSON.stringify({ id: "25OR624" }));
    requestHelpers = {
      getAuthorization: sinon.stub().returnsArg(0),
      getRoute: sinon
        .stub()
        .callsFake(({ route }) => `http://your.api.here${route}`),
      documentsToMultipart: sinon.stub().returnsArg(0),
      dataToMultipart: sinon.stub().returnsArg(0),
    };
    request = proxyquire("../../../lib/api/request", {
      "request-promise-native": requestLib,
      "./helpers/request": requestHelpers,
    });
  });

  describe("oneSpanRequest()", function () {
    beforeEach(function () {
      request.oneSpanRequest({
        method: "GET",
        route: "/dots/sticks/bricks/78",
        apiKey: "283FHJKH=",
        sandbox: true,
        sandboxDomain: "sandbox.domain",
      });
      requestPayload = requestLib.args[0][0];
    });

    it("should call request with a GET method", function () {
      expect(requestLib).to.have.been.calledOnce;
      expect(requestPayload.method).to.equal("GET");
    });

    it("should apply the correct headers", function () {
      expect(requestPayload.headers).to.eql({
        Authorization: "283FHJKH=",
        Accept: "application/json",
        "Content-Type": "application/json",
      });
    });

    it("should call getAuthorization with the apiKey to set the Authorization within the request header", function () {
      expect(requestHelpers.getAuthorization).to.have.been.calledOnce;
      expect(requestHelpers.getAuthorization).to.have.been.calledWith(
        "283FHJKH="
      );
      expect(requestPayload.headers.Authorization).to.equal("283FHJKH=");
    });

    it("should call getRoute with the route and sandbox to set the uri within the request", function () {
      expect(requestHelpers.getRoute).to.have.been.calledOnce;
      expect(requestHelpers.getRoute).to.have.been.calledWith({
        route: "/dots/sticks/bricks/78",
        sandbox: true,
        sandboxDomain: "sandbox.domain",
        domain: undefined,
      });
      expect(requestPayload.uri).to.equal(
        "http://your.api.here/dots/sticks/bricks/78"
      );
    });

    it("should be able to call the request.oneSpanRequest() method with a query string attached to the route", function () {
      request.oneSpanRequest({
        method: "GET",
        route: "/dots/sticks/bricks/78",
        query: {
          red: true,
          green: false,
        },
        apiKey: "283FHJKH=",
        sandbox: true,
      });
      requestPayload = requestLib.args[1][0];
      expect(requestPayload.uri).to.equal(
        "http://your.api.here/dots/sticks/bricks/78?red=true&green=false"
      );
    });

    it("should return the parsed response of the request", async function () {
      const response = await request.oneSpanRequest({
        method: "GET",
        route: "/dots/sticks/bricks/78",
        apiKey: "283FHJKH=",
        sandbox: true,
      });
      expect(response).to.eql({ id: "25OR624" });
    });
  });

  describe("oneSpanMultipartFormDataRequest()", function () {
    beforeEach(function () {
      request.oneSpanMultipartFormDataRequest({
        method: "POST",
        route: "/red/green/blue",
        documents: [
          new Document({
            name: "Koolaid",
            file: "koolaid.pdf",
          }),
        ],
        data: {
          name: "Koolaid Contract",
        },
        apiKey: "62222HG",
        sandbox: false,
        domain: "production.domain",
      });
      requestPayload = requestLib.args[0][0];
    });

    it("should call request with a POST method", function () {
      expect(requestLib).to.have.been.calledOnce;
      expect(requestPayload.method).to.equal("POST");
    });

    it("should call getAuthorization with the apiKey to set the Authorization within the request header", function () {
      expect(requestHelpers.getAuthorization).to.have.been.calledOnce;
      expect(requestHelpers.getAuthorization).to.have.been.calledWith(
        "62222HG"
      );
      expect(requestPayload.headers.Authorization).to.equal("62222HG");
    });

    it("should call getRoute with the route and sandbox to set the uri within the request", function () {
      expect(requestHelpers.getRoute).to.have.been.calledOnce;
      expect(requestHelpers.getRoute).to.have.been.calledWith({
        route: "/red/green/blue",
        sandbox: false,
        domain: "production.domain",
        sandboxDomain: undefined,
      });
      expect(requestPayload.uri).to.equal(
        "http://your.api.here/red/green/blue"
      );
    });

    it("should call documentsToMultipart with the documents to set the multipart elements in the request", function () {
      const document = new Document({
        name: "Koolaid",
        file: "koolaid.pdf",
      });
      expect(requestHelpers.documentsToMultipart).to.have.been.calledOnce;
      expect(requestHelpers.documentsToMultipart).to.have.been.calledWith([
        document,
      ]);
    });

    it("should call dataToMultipart with the data to set the multipart elements in the request", function () {
      expect(requestHelpers.dataToMultipart).to.have.been.calledOnce;
      expect(requestHelpers.dataToMultipart).to.have.been.calledWith({
        name: "Koolaid Contract",
      });
    });

    it("should return the parsed response of request", async function () {
      const response = await request.oneSpanMultipartFormDataRequest({
        method: "POST",
        route: "/red/green/blue",
        documents: [
          new Document({
            name: "Koolaid",
            file: "koolaid.pdf",
          }),
        ],
        data: {
          name: "Koolaid Contract",
        },
        apiKey: "62222HG",
        sandbox: false,
      });
      expect(response).to.eql({ id: "25OR624" });
    });
  });

  describe("oneSpanPDFRequest()", function () {
    beforeEach(function () {
      var response = {
        on: (eventName, cb) => {
          switch (eventName) {
            case "data":
              cb(Buffer.from("pdf-"));
              cb(Buffer.from("data"));
              break;
            case "end":
              cb();
              break;
            default:
              break;
          }
          return response;
        },
      };
      requestLib = sinon.stub().returns(response);
      requestHelpers = {
        getAuthorization: sinon.stub().returnsArg(0),
        getRoute: sinon
          .stub()
          .callsFake(({ route }) => `http://your.api.here${route}`),
      };
      request = proxyquire("../../../lib/api/request", {
        "request-promise-native": requestLib,
        "./helpers/request": requestHelpers,
      });
      request.oneSpanPDFRequest({
        method: "GET",
        route: "/packages/1/documents/1/pdf",
        query: {
          flatten: true,
        },
        apiKey: "283FHJKH=",
        sandbox: true,
        sandboxDomain: "sandbox.domain",
      });
      requestPayload = requestLib.args[0][0];
    });

    it("should call request with a GET method", function () {
      expect(requestLib).to.have.been.calledOnce;
      expect(requestPayload.method).to.equal("GET");
    });

    it("should apply the correct headers", function () {
      expect(requestPayload.headers).to.eql({
        Authorization: "283FHJKH=",
        Accept: "application/pdf",
      });
    });

    it("should call getAuthorization with the apiKey to set the Authorization within the request header", function () {
      expect(requestHelpers.getAuthorization).to.have.been.calledOnce;
      expect(requestHelpers.getAuthorization).to.have.been.calledWith(
        "283FHJKH="
      );
      expect(requestPayload.headers.Authorization).to.equal("283FHJKH=");
    });

    it("should call getRoute with the route and sandbox to set the uri within the request", function () {
      expect(requestHelpers.getRoute).to.have.been.calledOnce;
      expect(requestHelpers.getRoute).to.have.been.calledWith({
        route: "/packages/1/documents/1/pdf",
        sandbox: true,
        sandboxDomain: "sandbox.domain",
        domain: undefined,
      });
      expect(requestPayload.uri).to.equal(
        "http://your.api.here/packages/1/documents/1/pdf?flatten=true"
      );
    });

    it("should be able to call the request.oneSpanPDFRequest() method with a query string attached to the route", function () {
      request.oneSpanPDFRequest({
        method: "GET",
        route: "/packages/1/documents/1/pdf",
        query: {
          flatten: true,
        },
        apiKey: "283FHJKH=",
        sandbox: true,
      });
      requestPayload = requestLib.args[1][0];
      expect(requestPayload.uri).to.equal(
        "http://your.api.here/packages/1/documents/1/pdf?flatten=true"
      );
    });

    it("should listen/recieve data chunks, combine them into an arrayBuffer and return that arrayBuffer", async function () {
      const response = await request.oneSpanPDFRequest({
        method: "GET",
        route: "/packages/1/documents/1/pdf",
        query: {
          flatten: true,
        },
        apiKey: "283FHJKH=",
        sandbox: true,
      });
      expect(response).to.eql(Buffer.from("pdf-data"));
    });
  });
});
