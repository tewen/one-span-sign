require("dotenv").config();

const Client = require("../..");
const { createPackage, testEmail } = require("./helpers");

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
    await client.updatePackage(id, { status: Client.PACKAGE_STATUS.draft });

    console.log(`Pkg status updated to ${Client.PACKAGE_STATUS.draft}`);

    // Fetch the roles of the previously created Package
    const { roles } = await client.getPackage(id);

    const response = await client.updateSigner(id, roles[0].id, {
      firstName: "John",
      lastName: "Wick",
      email: testEmail({ firstName: "john", lastName: "wick" }),
    });

    console.log("Signer updated");
    console.log(response);
  } else {
    console.error(
      "Use the dev-setup.js script to set your sandbox API key in the environment."
    );
  }
}

main();
