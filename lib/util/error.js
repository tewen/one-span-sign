const ExtendableError = require('es6-error');

class InitializationError extends ExtendableError {}
class InvalidSignerError extends ExtendableError {}
class InvalidDocumentError extends ExtendableError {}
class InvalidPackageError extends ExtendableError {}
class APIError extends ExtendableError {}
class NotImplementedError extends ExtendableError {}

module.exports = {
  InitializationError,
  InvalidSignerError,
  InvalidDocumentError,
  InvalidPackageError,
  APIError,
  NotImplementedError
};
