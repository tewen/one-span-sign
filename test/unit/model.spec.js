const { expect } = require('chai');
const { Signer, Field, Document } = require('../../');

describe('models', function () {
  describe('Signer()', function () {
    it('should apply the role, firstName, lastName, and email properties in the constructor to the instance', function () {
      const signer = new Signer({
        firstName: 'Lemmy',
        lastName: 'Kilmister',
        email: 'lemmy500@hotmail.com'
      });
      expect(signer).to.include({
        firstName: 'Lemmy',
        lastName: 'Kilmister',
        email: 'lemmy500@hotmail.com'
      });
    });
  });

  describe('Field()', function () {
    it('should apply the name, role, and template properties in the constructor to the instance', function () {
      const field = new Field({
        name: 'red',
        role: 'admin',
        template: 't'
      });
      expect(field).to.include({
        name: 'red',
        role: 'admin',
        template: 't'
      });
    });
  });

  describe('Document()', function () {
    let document;

    beforeEach(function () {
      document = new Document({
        name: 'Income Tax',
        file: 'income_tax.pdf',
        signatureFields: ['red', new Field({ name: 'green' })],
        dateFields: ['blue', new Field({ name: 'orange' })],
        initialFields: ['yellow', 'purple', new Field({ name: 'brown' })]
      });
    });

    it('should apply the name, file, _signatureFields, _dateFields, and _initialFields in the constructor to the instance', function () {
      expect(document).to.include({
        name: 'Income Tax',
        file: 'income_tax.pdf'
      });
      expect(document._signatureFields).to.eql(['red', new Field({ name: 'green' })]);
      expect(document._dateFields).to.eql(['blue', new Field({ name: 'orange' })]);
      expect(document._initialFields).to.eql(['yellow', 'purple', new Field({ name: 'brown' })]);
    });

    describe('get signatureFields()', function () {
      it('should convert the strings provided initially to Fields', function () {
        expect(document.signatureFields).to.eql([new Field({ name: 'red' }), new Field({ name: 'green' })]);
      });
    });

    describe('get dateFields()', function () {
      it('should convert the strings provided initially to Fields', function () {
        expect(document.dateFields).to.eql([new Field({ name: 'blue' }), new Field({ name: 'orange' })]);
      });
    });

    describe('get initialFields()', function () {
      it('should convert the strings provided initially to Fields', function () {
        expect(document.initialFields).to.eql([new Field({ name: 'yellow' }), new Field({ name: 'purple' }), new Field({ name: 'brown' })]);
      });
    });
  });
});
