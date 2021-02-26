require("dotenv").config();

const Client = require("../..");
const { createPackage } = require("./helpers");

async function main() {
  if (process.env.SANDBOX_API_KEY) {
    const client = new Client({
      apiKey: process.env.SANDBOX_API_KEY,
      sandbox: true,
      sandboxDomain: process.env.SANDBOX_DOMAIN,
    });

    // File path version
    const { id } = await createPackage(client);

    console.log(`Created sample package with id: ${id}`);

    // Fetch the documents for the previously created Package
    const { documents } = await client.getPackage(id);

    const response = await client.getDocument(id, documents[0].id);

    console.log("Retrieved document");
    console.log(response);
  } else {
    console.error(
      "Use the dev-setup.js script to set your sandbox API key in the environment."
    );
  }
}

main();
