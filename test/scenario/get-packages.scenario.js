require('dotenv').config();

const _ = require('lodash');
const Client = require('../../');
const { createPackage } = require('./helpers');

async function main() {
  if (process.env.SANDBOX_API_KEY) {
    const client = new Client({
      apiKey: process.env.SANDBOX_API_KEY,
      sandbox: true
    });

    // File path version
    const createResponses = await Promise.all([
      createPackage(client, 'A'),
      createPackage(client, 'B')
    ]);

    console.log(`Created packages with ids: ${_.map(createResponses, 'id').join(', ')}`);

    const response = await client.getPackages();

    if (response.results.length >= 2) {
      console.log('Retrieved packages');
      console.log(JSON.stringify(response));
    } else {
      throw new Error('Expectation failed, less than 2 packages retrieved.');
    }
  } else {
    console.error('Use the dev-setup.js script to set your sandbox API key in the environment.');
  }
}

main();
