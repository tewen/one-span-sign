const { expect } = require('chai');

describe('api/package', function() {
  describe('assemblePackage()', function() {
    it('should throw an InvalidPackageError if the name is empty', function () {
      // TODO
    });

    it('should throw an InvalidPackageError if the documents are empty', function () {
      // TODO
    });

    it('should throw an InvalidDocumentError if any of the documents provided are invalid', function () {
      // TODO
    });

    it('should throw an InvalidSignerError if any signers provided are invalid', function () {
      // TODO
    });

    it('should build a package utilizing the provided name, description, documents, and signers', function () {
      // TODO
    });

    it('should default the package to use the name in the place of the description if none is provided', function () {
      // TODO
    });
  });
});
