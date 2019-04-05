require('dotenv').config();

const Client = require('../../');
const { Signer } = Client;
const { createPackage } = require('./helpers');

async function main() {
  if (process.env.SANDBOX_API_KEY) {
    const client = new Client({
      apiKey: process.env.SANDBOX_API_KEY,
      sandbox: true,
      sandboxDomain: process.env.SANDBOX_DOMAIN
    });

    // File path version
    const { id } = await createPackage(client);

    console.log(`Created sample package with id: ${id}`);

    const responseA = await client.getPackageSigningUrl(id, 'Crackers');
    const responseB = await client.getPackageSigningUrl(id, new Signer({ role: 'Crackers' }));

    console.log('Retrieved package');
    console.log(JSON.stringify(responseA));
    console.log(JSON.stringify(responseB));
  } else {
    console.error('Use the dev-setup.js script to set your sandbox API key in the environment.');
  }
}

main();
