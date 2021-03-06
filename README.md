## One Span Sign

This project is an open source node module for interracting with the popular [One Span Sign (formerly eSignLive)](https://www.esignlive.com/) REST API.

### Installation

```BASH
npm install -g one-span-sign
npm install --save one-span-sign
```

### Getting Started

In order to call the One Span Sign API, you will need to be setup wit an API Key. You will likely have both a sandbox API Key and a production API Key.


##### Production (Default)
The default API domain is 'apps.esignlive.com'. Documentation [here](https://docs.esignlive.com/content/c_integrator_s_guide/rest_api/rest_api.htm?Highlight=api%20url#The_API_URLs) for more info.

```JavaScript
const OneSpanClient = require('one-span-sign');

const client = new OneSpanClient({apiKey: 'YOUR_KEY_HERE'});
const response = await client.createPackage(...); //See below for arguments here
```

##### Production (Custom Domain)
For alternative domains, see [here](https://docs.esignlive.com/content/c_integrator_s_guide/rest_api/rest_api.htm?Highlight=api%20url#The_API_URLs).

```JavaScript
const OneSpanClient = require('one-span-sign');

const client = new OneSpanClient({apiKey: 'YOUR_KEY_HERE', domain: 'apps.e-signlive.ca'}); // Canadian domain, for example
const response = await client.createPackage(...); //See below for arguments here
```

##### Sandbox/Dev (Default)
The default API domain is 'sandbox.esignlive.com'. Documentation [here](https://docs.esignlive.com/content/c_integrator_s_guide/rest_api/rest_api.htm?Highlight=api%20url#The_API_URLs) for more info.

```JavaScript
const OneSpanClient = require('one-span-sign');

const client = new OneSpanClient({apiKey: 'YOUR_KEY_HERE', sandbox: true});
const response = await client.createPackage(...); //See below for arguments here
```

##### Sandbox/Dev (Custom Domain)
For alternative domains, see [here](https://docs.esignlive.com/content/c_integrator_s_guide/rest_api/rest_api.htm?Highlight=api%20url#The_API_URLs).

```JavaScript
const OneSpanClient = require('one-span-sign');

const client = new OneSpanClient({apiKey: 'YOUR_KEY_HERE', sandbox: true, sandboxDomain: 'signer-sandbox-gov.esignlive.com'}); // Government domain, for example
const response = await client.createPackage(...); //See below for arguments here
```

### Methods

#### getPackage(id)

[One Span Documentation](https://docs.esignlive.com/content/c_integrator_s_guide/rest_api/packages.htm#Get)

An existing package can be retrieved via the package id returned after creation.

```JavaScript
const OneSpanClient = require('one-span-sign');

const client = new OneSpanClient({apiKey: 'YOUR_KEY_HERE'});
const response = await client.getPackage('PACKAGE_ID_HERE');
```


#### getPackages([query])

[One Span Documentation](https://docs.esignlive.com/content/c_integrator_s_guide/rest_api/packages.htm#Retrieve)

An existing list of packages can be retrieved.

```JavaScript
const OneSpanClient = require('one-span-sign');

const client = new OneSpanClient({apiKey: 'YOUR_KEY_HERE'});
const response = await client.getPackages({sort: 'created'});

/** 
You can pass-in optional query params that are appended to the request
The default query is {from: 0, to: 100}, which returns 100 packages
*/
```


#### getPackageSigningUrl(id, roleOrSigner)

[One Span Documentation](https://docs.esignlive.com/content/c_integrator_s_guide/rest_api/signing_url.htm?Highlight=signingUrl)

Retrieves the signing url for a particular role.

```JavaScript
const OneSpanClient = require('one-span-sign');
const { Signer } = OneSpanClient;

const client = new OneSpanClient({apiKey: 'YOUR_KEY_HERE'});
const responseA = await client.getPackageSigningUrl('PACKAGE_ID_HERE', 'ROLE_HERE');

console.log(responseA.url); // Signing url

/**
  OR
*/

const responseB = await client.getPackageSigningUrl('PACKAGE_ID_HERE', new Signer({role: 'ROLE_HERE'}));

console.log(responseB.url); // Signing url
```


#### createPackage(package)

[One Span Documentation](https://docs.esignlive.com/content/c_integrator_s_guide/rest_api/packages.htm#Create)

Packages should be assembled using the Document, Field, and Signer models from the library.

```JavaScript
const OneSpanClient = require('one-span-sign');
const { Document, Field, Signer } = OneSpanClient;

const client = new OneSpanClient({apiKey: 'YOUR_KEY_HERE'});
const response = await client.createPackage(
      'Income Tax', // name
      'Income Tax Form', // description
      [
          new Document({
            name: 'Income Tax Form',
            file: 'local/path/to.pdf',
            signatureFields: [
              new Field({
                name: 'sigPrep',
                role: 'Cheese'
              }),
              new Field({
                name: 'f1-66',
                role: 'Crackers',
                template: { subtype: 'CAPTURE' }
              })
            ]
          })
      ], // documents
      [
        new Signer({
          role: 'Cheese',
          firstName: 'Rollo',
          lastName: 'Sly',
          email: 'rollosly@hotmail.com'
        }),
        new Signer({
          role: 'Crackers',
          firstName: 'Mitch',
          lastName: 'Kooly',
          email: 'mitchkooly@lycos.com'
        })
      ] // signers
      );
```

### Upcoming Additions

* getPackageSigningStatus()
* updatePackage()
* deletePackage()
* clonePackage()
* getDocument()

### Contribution Guidelines

Fork the respository and install all the dependencies:

```BASH
npm install
```

Run the npm setup script in the project root directory:

```BASH
npm run setup
```

Make sure to run the unit tests before committing. Obviously, add to the tests as you make changes:

```BASH
npm run test
```

For watch:

```BASH
npm run test:watch
```
