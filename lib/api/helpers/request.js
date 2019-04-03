const _ = require('lodash');
const mime = require('mime');
const fs = require('fs-extra');

const getAuthorization = (apiKey) => `Basic ${apiKey}`;
const getRoute = ({ route, domain, sandbox, sandboxDomain }) => (sandbox ? `https://${sandboxDomain}/api${route}` : `https://${domain}/api${route}`);

function documentsToMultipart(documents, encoding = 'application/pdf') {
  return _.map(documents, ({ name, file }) => ({
    'Content-Disposition': `form-data; name="file"; filename="${name}"`,
    'Content-Type': mime.getType(file),
    'Content-Transfer-Encoding': encoding,
    body: _.isString(file) ? fs.createReadStream(file) : file
  }));
}

function dataToMultipart(data, name = 'payload') {
  return {
    'Content-Disposition': `form-data; name="${name}"`,
    'Content-Type': 'application/json; charset=UTF-8',
    body: JSON.stringify(data)
  }
}

module.exports = {
  getAuthorization,
  getRoute,
  documentsToMultipart,
  dataToMultipart
};
