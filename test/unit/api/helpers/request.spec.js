const { expect } = require('chai');
const { getAuthorization, getRoute } = require('../../../../lib/api/helpers/request');

describe('api/helpers/request', function () {
  describe('getAuthorization()', function () {
    it('should return the basic authorization from the apiKey provided', function () {
      expect(getAuthorization('25OR624=')).to.equal('Basic 25OR624=');
    });
  });

  describe('getRoute()', function () {
    it('should return the sandbox route in the sandbox case', function () {
      expect(getRoute({
        route: '/koolaid',
        sandbox: true,
        domain: 'production.domain',
        sandboxDomain: 'sandbox.domain'
      })).to.equal('https://sandbox.domain/api/koolaid');
    });

    it('should return the production route in the non-sandbox case', function () {
      expect(getRoute({
        route: '/koolaid',
        sandbox: false,
        domain: 'production.domain',
        sandboxDomain: 'sandbox.domain'
      })).to.equal('https://production.domain/api/koolaid');
    });

    it('should return the production route in the default case', function () {
      expect(getRoute({
        route: '/koolaid',
        domain: 'production.domain',
        sandboxDomain: 'sandbox.domain'
      })).to.equal('https://production.domain/api/koolaid');
    });
  });

  describe('documentsToMultipart()', function () {
    it('should map the documents out to multipart content nodes with application/pdf by default', function () {
      // TODO
    });

    it('should play nice with files as streams', function () {
      // TODO
    });

    it('should play nice with files as strings', function () {
      // TODO
    });

    it('should play nice with a mix of strings and streams', function () {
      // TODO
    });
  });

  describe('dataToMultipart()', function () {
    it('should map the stringified data out to a multipart content node with the name payload', function () {
      // TODO
    });
  });
});
