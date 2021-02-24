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

    const response = await client.addSigner(id, {
      // Id is optional but if defined then should be in uuid format otherwise remove key or set undefined 
      id: "4068a741-c2b2-4f92-bc38-a3d7b4f97c47",
      firstName: "John",
      lastName: "Wick",
      email: testEmail({ firstName: "john", lastName: "wick" }),
    });

    console.log("Signer created");
    console.log(response);
  } else {
    console.error(
      "Use the dev-setup.js script to set your sandbox API key in the environment."
    );
  }
}

main();
