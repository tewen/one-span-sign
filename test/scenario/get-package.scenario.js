require('dotenv').config();

const path = require('path');
const Client = require('../../');
const { Signer, Document, Field } = require('../../index');
const { testEmail } = require('./helpers');

const INCOME_TAX_FORM_PATH = path.join(__dirname, 'pdfs/income_tax_form.pdf');

function createPackage(client) {
  return client.createPackage(
    'Income Tax A',
    'File path version of test',
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

async function main() {
  if (process.env.SANDBOX_API_KEY) {
    const client = new Client({
      apiKey: process.env.SANDBOX_API_KEY,
      sandbox: true
    });

    // File path version
    const { id } = await createPackage(client);

    console.log(`Created sample package with id: ${id}`);

    const response = await client.getPackage(id);

    console.log('Retrieved package');
    console.log(JSON.stringify(response));
  } else {
    console.error('Use the dev-setup.js script to set your sandbox API key in the environment.');
  }
}

main();
