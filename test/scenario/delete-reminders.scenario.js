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

    // Change package status so that we are able to update pkg signers
    await client.updatePackage(id, { status: Client.PACKAGE_STATUS.DRAFT });

    console.log(`Pkg status updated to ${Client.PACKAGE_STATUS.DRAFT}`);
    
    await client.createReminders(id);

    console.log(`Created sample reminder for pkg : ${id}`);

    const response = await client.deleteReminders(id);

    console.log(`Reminders deleted for pkg : ${id}`);
    console.log(response);
  } else {
    console.error(
      "Use the dev-setup.js script to set your sandbox API key in the environment."
    );
  }
}

main();
