const { Document, Signer, Field } = require('./lib/models');
const Client = require('./lib/client');
Client.Document = Document;
Client.Signer = Signer;
Client.Field = Field;
Client.Errors = require('./lib/util/error');
module.exports = Client;
