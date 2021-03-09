const _ = require("lodash");
const { PACKAGES, DOCUMENTS, ROLES, REMINDERS } = require("./api/one-span");
const {
  oneSpanRequest,
  oneSpanMultipartFormDataRequest,
  oneSpanPDFRequest,
} = require("./api/request");
const assemblePackage = require("./api/package");
const assembleSigner = require("./api/signer");
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

  createPackage(name, description, documents, signers, status) {
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
            status,
          }),
        },
        requestProperties(this)
      )
    );
  }

  updatePackage(packageId, body) {
    return oneSpanRequest(
      _.merge(
        {
          method: "PUT",
          route: `${PACKAGES.ROUTE}/${packageId}`,
          body,
        },
        requestProperties(this)
      )
    );
  }

  deletePackage() {
    throw new NotImplementedError();
  }

  clonePackage() {
    throw new NotImplementedError();
  }

  createReminders(
    packageId,
    { startInDaysDelay = 1, repetitionsCount = 5, intervalInDays = 1 } = {}
  ) {
    return oneSpanRequest(
      _.merge(
        {
          method: "POST",
          route: `${PACKAGES.ROUTE}/${packageId}${REMINDERS.ROUTE}`,
          body: {
            startInDaysDelay,
            repetitionsCount,
            intervalInDays,
            packageId,
          },
        },
        requestProperties(this)
      )
    );
  }

  getReminders(packageId) {
    return oneSpanRequest(
      _.merge(
        {
          method: "GET",
          route: `${PACKAGES.ROUTE}/${packageId}${REMINDERS.ROUTE}`,
        },
        requestProperties(this)
      )
    );
  }

  updateReminders(
    packageId,
    { startInDaysDelay = 1, repetitionsCount = 5, intervalInDays = 1 } = {}
  ) {
    return oneSpanRequest(
      _.merge(
        {
          method: "PUT",
          route: `${PACKAGES.ROUTE}/${packageId}${REMINDERS.ROUTE}`,
          body: {
            startInDaysDelay,
            repetitionsCount,
            intervalInDays,
            packageId,
          },
        },
        requestProperties(this)
      )
    );
  }

  deleteReminders(packageId) {
    return oneSpanRequest(
      _.merge(
        {
          method: "DELETE",
          route: `${PACKAGES.ROUTE}/${packageId}${REMINDERS.ROUTE}`,
        },
        requestProperties(this)
      )
    );
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

  addSigner(packageId, body) {
    return oneSpanRequest(
      _.merge(
        {
          method: "POST",
          route: `${PACKAGES.ROUTE}/${packageId}${ROLES.ROUTE}`,
          body: assembleSigner(body),
        },
        requestProperties(this)
      )
    );
  }

  updateSigner(packageId, signerId, body) {
    return oneSpanRequest(
      _.merge(
        {
          method: "PUT",
          route: `${PACKAGES.ROUTE}/${packageId}${ROLES.ROUTE}/${signerId}`,
          body: assembleSigner(body),
        },
        requestProperties(this)
      )
    );
  }

  removeSigner(packageId, signerId) {
    return oneSpanRequest(
      _.merge(
        {
          method: "DELETE",
          route: `${PACKAGES.ROUTE}/${packageId}${ROLES.ROUTE}/${signerId}`,
        },
        requestProperties(this)
      )
    );
  }

  resendSigningInvitation(packageId, signerId) {
    return oneSpanRequest(
      _.merge(
        {
          method: "POST",
          route: `${PACKAGES.ROUTE}/${packageId}${ROLES.ROUTE}/${signerId}/notifications`,
        },
        requestProperties(this)
      )
    );
  }
}

Client.PACKAGE_STATUS = PACKAGES.STATUS;

module.exports = Client;
