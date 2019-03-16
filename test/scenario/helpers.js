const path = require('path');
const { Signer, Document, Field } = require('../../index');
const INCOME_TAX_FORM_PATH = path.join(__dirname, 'pdfs/income_tax_form.pdf');

function testEmail({ firstName, lastName }) {
  return `onespansignopensource+${firstName}${lastName}@gmail.com`
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createPackage(client, letterOrIndex = 'A', description = 'File path version of test') {
  return client.createPackage(
    `Income Tax ${letterOrIndex}`,
    description,
    new Document({
      name: 'Income Tax Form',
      file: INCOME_TAX_FORM_PATH,
      signatureFields: [
        new Field({
          name: 'sigPrep',
          role: 'Cheese',
          template: { subtype: 'CAPTURE' }
        }),
        new Field({
          name: 'f1-66',
          role: 'Crackers',
          template: { subtype: 'CAPTURE' }
        })
      ]
    }),
    [
      new Signer({
        role: 'Cheese',
        firstName: 'Rollo',
        lastName: 'Sly',
        email: testEmail({
          firstName: 'Rollo',
          lastName: 'Sly'
        })
      }),
      new Signer({
        role: 'Crackers',
        firstName: 'Mitch',
        lastName: 'Kooly',
        email: testEmail({
          firstName: 'Mitch',
          lastName: 'Kooly'
        })
      })
    ]);
}

module.exports = {
  testEmail,
  timeout,
  createPackage
};
