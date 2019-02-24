const prompts = require('prompts');
const fs = require('fs-extra');

async function main() {
  const response = await prompts([
    {
      type: 'text',
      name:'apiKey',
      message: 'What is your E-Sign Live sandbox API key?'
    }
  ]);
  await fs.writeFile('.env', `SANDBOX_API_KEY=${response.apiKey}`);
  console.log('Finished creating .env file');
}

main();
