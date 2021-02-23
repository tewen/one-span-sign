const _ = require("lodash");
const { PACKAGES, DOCUMENTS } = require("./api/one-span");
const {
  oneSpanRequest,
  oneSpanMultipartFormDataRequest,
  oneSpanPDFRequest,
} = require("./api/request");
const assemblePackage = require("./api/package");
const { alwaysArray } = require("./util/object");
const { InitializationError, NotImplementedError } = require("./util/error");
const { API_URLS } = require("./api/documentation");

const DEFAULT_DOMAIN = "apps.esignlive.com";
const DEFAULT_SANDBOX_DOMAIN = "sandbox.esignlive.com";

const requestProperties = (instance) =>
  _.pick(instance, ["apiKey", "sandbox", "domain", "sandboxDomain"]);

class Client {
  constructor({
    apiKey,
    sandbox,
    domain = DEFAULT_DOMAIN,
    sandboxDomain = DEFAULT_SANDBOX_DOMAIN,
  }) {
    if (!_.isString(apiKey)) {
      throw new InitializationError(
        "You must pass an apiKey:String property to the client constructor."
      );
    } else if (!_.isString(domain) || _.isEmpty(domain)) {
      throw new InitializationError(
        `You must pass an domain:String property to the client constructor. The default is '${DEFAULT_DOMAIN}'. Refer to ${API_URLS} for more information.`
      );
    } else if (
      sandbox &&
      (!_.isString(sandboxDomain) || _.isEmpty(sandboxDomain))
    ) {
      throw new InitializationError(
        `You must pass an sandboxDomain:String property to the client constructor. The default is '${DEFAULT_SANDBOX_DOMAIN}'. Refer to ${API_URLS} for more information.`
      );
    }
    this.apiKey = apiKey;
    this.sandbox = sandbox;
    this.domain = domain;
    this.sandboxDomain = sandboxDomain;
  }

  getPackage(id) {
    return oneSpanRequest(
      _.merge(
        {
          method: "GET",
          route: `${PACKAGES.ROUTE}/${id}`,
        },
        requestProperties(this)
      )
    );
  }

  getPackages(
    query = {
      from: 0,
      to: 100,
    }
  ) {
    return oneSpanRequest(
      _.merge(
        {
          method: "GET",
          route: `${PACKAGES.ROUTE}`,
          query,
        },
        requestProperties(this)
      )
    );
  }

  getPackageSigningUrl(id, roleOrSigner) {
    const role = _.isObject(roleOrSigner) ? roleOrSigner.role : roleOrSigner;
    return oneSpanRequest(
      _.merge(
        {
          method: "GET",
          route: `${PACKAGES.ROUTE}/${id}/roles/${role}/signingUrl`,
        },
        requestProperties(this)
      )
    );
  }

  getPackageSigningStatus() {
    throw new NotImplementedError();
  }

  createPackage(name, description, documents, signers) {
    return oneSpanMultipartFormDataRequest(
      _.merge(
        {
          method: "POST",
          route: PACKAGES.ROUTE,
          documents: alwaysArray(documents),
          data: assemblePackage({
            name,
            description,
            documents: alwaysArray(documents),
            signers: alwaysArray(signers),
          }),
        },
        requestProperties(this)
      )
    );
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

  getDocument(packageId, documentId) {
    return oneSpanPDFRequest(
      _.merge(
        {
          method: "GET",
          route: `${PACKAGES.ROUTE}/${packageId}${DOCUMENTS.ROUTE}/${documentId}/pdf`,
          query: {
            flatten: true,
          },
        },
        requestProperties(this)
      )
    );
  }
}

module.exports = Client;
