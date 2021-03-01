const _ = require("lodash");

function assembleSigner(body) {
  const payload = {
    type: "SIGNER",
    signers: [body],
  };
  if (!_.isUndefined(body.id)) {
    payload.id = body.id;
    payload.name = body.id;
  }
  return payload;
}

module.exports = assembleSigner;
