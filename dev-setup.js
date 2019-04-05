const prompts = require('prompts');
const fs = require('fs-extra');
const _ = require('lodash');

async function main() {
  const response = await prompts([
    {
      type: 'text',
      name:'apiKey',
      message: 'What is your E-Sign Live sandbox API key?'
    },
    {
      type: 'text',
      name: 'sandboxDomain',
      message: 'The sandbox domain you wish to use?',
      initial: 'sandbox.esignlive.com'
    }
  ]);
  await fs.writeFile('.env', _.join([`SANDBOX_API_KEY=${response.apiKey}`, `SANDBOX_DOMAIN=${response.sandboxDomain}`], '\n'));
  console.log('Finished creating .env file');
}

main();
