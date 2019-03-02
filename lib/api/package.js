const _ = require('lodash');
const { alwaysArray, splitOrArray } = require('../util/object');
const { InvalidSignerError, InvalidDocumentError, InvalidPackageError } = require('../util/error');

const PACKAGE_TEMPLATE = () => _.cloneDeep(require('../templates/package.json'));
const DOCUMENT_TEMPLATE = () => _.cloneDeep(require('../templates/document.json'));
const ROLE_TEMPLATE = () => _.cloneDeep(require('../templates/role.json'));

function fieldReducer(ar, template) {
  return _.reduce(ar, (sum, field) => {
    sum[field.role] = sum[field.role] || []; // eslint-disable-line no-param-reassign
    sum[field.role].push(_.merge({}, template, { name: field.name }, field.template));
    return sum;
  }, {});
}

function mergeReductions(...args) {
  return _.reduce(args, (sum, rolesToFields) => {
    _.each(rolesToFields, (fields, role) => {
      const existing = _.find(sum, { role });
      if (existing) {
        existing.fields = existing.fields.concat(fields);
      } else {
        sum.push({
          role,
          fields
        });
      }
    });
    return sum;
  }, []);
}

// Not the most efficient, but this issue was introduced later via https://developer.esignlive.com/forums/topic/problems-with-multiple-signature-and-initial-fields/#post-4173
function splitApprovals(ar) {
  return _.chain(ar)
    .map((approval) =>
      _.reduce(approval.fields, (sum, field) => {
        const lastApproval = _.last(sum);

        // Either we do not have a lastApproval or there is already a signature in the one that exists
        if (!lastApproval || (field.type === 'SIGNATURE' && _.find(lastApproval.fields, { type: 'SIGNATURE' }))) {
          sum.push({
            role: approval.role,
            fields: [field]
          });
        } else {
          lastApproval.fields.push(field);
        }
        return sum;
      }, [])
    )
    .flatten()
    .value();
}

function docApprovals({ initialFields, dateFields, signatureFields } = {}) {
  return splitApprovals(
    mergeReductions(
      fieldReducer(initialFields, {
        type: 'SIGNATURE',
        extract: true,
        subtype: 'INITIALS',
        required: true,
        name: undefined
      }),
      fieldReducer(dateFields, {
        type: 'INPUT',
        extract: true,
        subtype: 'LABEL',
        required: true,
        binding: '{approval.signed}'
      }),
      fieldReducer(signatureFields, {
        type: 'SIGNATURE',
        extract: true,
        subtype: 'FULLNAME',
        required: true,
        name: undefined
      })
    ));
}

// This ensures that if an optional role was not filled, their approvals are not added
function clearApprovalsMissingRoles(pkg) {
  const indexedRoles = _.groupBy(pkg.roles, _.property('id'));
  pkg.documents = _.map(pkg.documents, (doc) => { // eslint-disable-line no-param-reassign
    doc.approvals = _.filter(doc.approvals, (approval) => indexedRoles[approval.role]); // eslint-disable-line no-param-reassign
    return doc;
  });
  return pkg;
}

// NOTE - Builder is a legacy pattern for now, we remove this in a future iteration
class Builder {
  constructor() {
    this.steps = {};
    this.payload = PACKAGE_TEMPLATE();
  }

  package(name, description) {
    _.merge(this.payload, {
      name,
      description
    });
    this.steps.package = true;
    return this;
  }

  roles(customerFirstName, customerLastName, customerEmail, identifier, sendEmail = true, optional = false) {
    if (customerFirstName && customerLastName && customerEmail) {
      const role = ROLE_TEMPLATE();
      _.merge(role.signers[0], {
        firstName: customerFirstName || '',
        lastName: customerLastName || '',
        email: _.last(splitOrArray(customerEmail)),
        id: identifier,
        delivery: {
          email: sendEmail,
          provider: sendEmail,
          download: sendEmail
        }
      });
      role.name = identifier;
      role.id = identifier;

      // We set a custom email message for dealers only
      role.emailMessage.content = 'This is email message content for this role.';

      this.payload.roles.push(role);

      this.steps.roles = true;
    } else if (!optional) {
      throw new InvalidPackageError('First name, last name and email are required arguments for a new package.');
    }
    return this;
  }

  documents(docs) {
    this.payload.documents = _.map(alwaysArray(docs), (dn) => {
      const doc = DOCUMENT_TEMPLATE();
      doc.name = dn.name;

      doc.approvals = docApprovals(dn);

      return doc;
    });

    this.steps.documents = true;
    return this;
  }

  build() {
    if (this.steps.package && this.steps.roles && this.steps.documents) {
      return clearApprovalsMissingRoles(this.payload);
    } else {
      throw new InvalidPackageError('You have skipped a package, roles, documents, or approval step in building your package.');
    }
  }
}

function isPackageValid({ name, documents, signers }) {
  if (_.isEmpty(name)) {
    throw new InvalidPackageError('A name is required for a new package.');
  }
  if (_.isEmpty(documents)) {
    throw new InvalidPackageError('Documents are required for a new package.');
  }
  const invalidDoc = _.find(documents, (doc) => !doc.hasRequiredProperties());
  if (invalidDoc) {
    throw new InvalidDocumentError(`Document missing required properties: ${_.join(invalidDoc.missingProperties(), ', ')}.`);
  }
  if (_.isEmpty(signers)) {
    throw new InvalidPackageError('Signers are required for a new package.');
  }
  const invalidSigner = _.find(signers, (signer) => !signer.hasRequiredProperties());
  if (invalidSigner) {
    throw new InvalidSignerError(`Signer missing required properties: ${_.join(invalidSigner.missingProperties(), ', ')}.`);
  }
  return true;
}

function assemblePackage({ name, description, documents, signers }) {
  if (isPackageValid({
    name,
    description,
    documents,
    signers
  })) {
    let builder = new Builder()
      .package(name, description || name)
      .documents(documents);
    _.each(signers, (signer) => {
      builder = builder.roles(signer.firstName, signer.lastName, signer.email, signer.role);
    });
    return builder.build()
  }
}

module.exports = assemblePackage;
