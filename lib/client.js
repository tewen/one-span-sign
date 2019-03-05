const _ = require('lodash');
const { PACKAGES } = require('./api/one-span');
const { oneSpanRequest, oneSpanMultipartFormDataRequest } = require('./api/request');
  const assemblePackage = require('./api/package');
const { alwaysArray } = require('./util/object');
const { InitializationError, NotImplementedError } = require('./util/error');

class Client {
  constructor({ apiKey, sandbox }) {
    if (!_.isString(apiKey)) {
      throw new InitializationError('You must pass an apiKey:String property to the client constructor.');
    }
    this.apiKey = apiKey;
    this.sandbox = sandbox
  }

  getPackage(id) {
    return oneSpanRequest({
      method: 'GET',
      route: `${PACKAGES.ROUTE}/${id}`,
      apiKey: this.apiKey,
      sandbox: this.sandbox
    });
  }

  getPackages() {
    throw new NotImplementedError();
  }

  getPackageSigningUrl() {
    throw new NotImplementedError();
  }

  getPackageSigningStatus() {
    throw new NotImplementedError();
  }

  createPackage(name, description, documents, signers) {
    return oneSpanMultipartFormDataRequest({
      method: 'POST',
      route: PACKAGES.ROUTE,
      documents: alwaysArray(documents),
      data: assemblePackage({
        name,
        description,
        documents: alwaysArray(documents),
        signers: alwaysArray(signers)
      }),
      apiKey: this.apiKey,
      sandbox: this.sandbox
    });
  }

  updatePackage() {
    throw new NotImplementedError();
  }

  deletePackage() {
    throw new NotImplementedError();
  }

  clonePackage() {
    throw new NotImplementedError();
  }

  getDocument() {
    throw new NotImplementedError();
  }
}

module.exports = Client;
