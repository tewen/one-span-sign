const { expect } = require('chai'); // eslint-disable-line no-unused-vars

describe('api/helpers/request', function () {
  describe('getAuthorization()', function () {
    it('should return the basic authorization from the apiKey provided', function () {
      // TODO
    });
  });

  describe('getRoute()', function () {
    it('should return the sandbox route in the sandbox case', function () {
      // TODO
    });

    it('should return the production route in the non-sandbox case', function () {
      // TODO
    });
  });

  describe('documentsToMultipart()', function () {
    it('should map the documents out to multipart content nodes with application/pdf by default', function () {
      // TODO
    });
  });

  describe('dataToMultipart()', function () {
    it('should map the stringified data out to a multipart content node with the name payload', function () {
      // TODO
    });
  });
});
