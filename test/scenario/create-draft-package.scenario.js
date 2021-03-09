require("dotenv").config();

const path = require("path");
const Client = require("../..");
const { Signer, Document, Field } = require("../../index");
const { testEmail, timeout } = require("./helpers");

const INCOME_TAX_FORM_PATH = path.join(__dirname, "pdfs/income_tax_form.pdf");

async function main() {
  if (process.env.SANDBOX_API_KEY) {
    const client = new Client({
      apiKey: process.env.SANDBOX_API_KEY,
      sandbox: true,
      sandboxDomain: process.env.SANDBOX_DOMAIN,
    });

    // File path version
    const responseA = await client.createPackage(
      "Income Tax A",
      "File path version of test",
      new Document({
        name: "Income Tax Form",
        file: INCOME_TAX_FORM_PATH,
        signatureFields: [
          new Field({
            name: "sigPrep",
            role: "Cheese",
            template: { subtype: "CAPTURE" },
          }),
          new Field({
            name: "f1-66",
            role: "Crackers",
            template: { subtype: "CAPTURE" },
          }),
        ],
      }),
      [
        new Signer({
          role: "Cheese",
          firstName: "Rollo",
          lastName: "Sly",
          email: testEmail({
            firstName: "Rollo",
            lastName: "Sly",
          }),
        }),
        new Signer({
          role: "Crackers",
          firstName: "Mitch",
          lastName: "Kooly",
          email: testEmail({
            firstName: "Mitch",
            lastName: "Kooly",
          }),
        }),
      ],
      Client.PACKAGE_STATUS.DRAFT
    );

    console.log(responseA);

    const responseB = await client.getPackage(responseA.id);

    console.log(responseB);

    await timeout(2000);
  } else {
    console.error(
      "Use the dev-setup.js script to set your sandbox API key in the environment."
    );
  }
}

main();
