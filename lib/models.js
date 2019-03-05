const _ = require('lodash');

class Validated {
  constructor() {}

  requireProperties(...props) {
    this.requiredProperties = props;
  }

  hasRequiredProperties() {
    return _.every(this.requiredProperties, (prop) => !_.isNil(this[prop]));
  }

  missingProperties() {
    return _.filter(this.requiredProperties, (prop) => _.isNil(this[prop]));
  }
}

class Signer extends Validated {
  constructor({ role, firstName, lastName, email } = {}) {
    super();
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    // Determine what is required
    this.requireProperties('role', 'firstName', 'lastName', 'email');
  }
}

class Field extends Validated {
  constructor({ name, role, template } = {}) {
    super();
    this.name = name;
    this.role = role;
    this.template = template;
    // Determine what is required
    this.requireProperties('name');
  }
}

class Document extends Validated {
  static convertStringsToFields(ar) {
    return _.map(ar, (field) => _.isString(field) ? new Field({ name: field }) : field);
  }

  constructor({ name, file, signatureFields, dateFields, initialFields } = {}) {
    super();
    this.name = name;
    this.file = file;
    this._signatureFields = signatureFields;
    this._dateFields = dateFields;
    this._initialFields = initialFields;
    // Determine what is required
    this.requireProperties('name', 'file');
  }

  get signatureFields() {
    return Document.convertStringsToFields(this._signatureFields);
  }

  get dateFields() {
    return Document.convertStringsToFields(this._dateFields);
  }

  get initialFields() {
    return Document.convertStringsToFields(this._initialFields);
  }
}

module.exports = {
  Signer,
  Field,
  Document
};
