const _ = require('lodash');
const request = require('request-promise-native');
const https = require('https');
const { getAuthorization, getRoute, documentsToMultipart, dataToMultipart } = require('./helpers/request');
const { APIError, NotImplementedError } = require('../util/error');
const { safeJsonParse } = require('../util/object');

function oneSpanRequest({ method, route, apiKey, sandbox }) {
  throw new NotImplementedError();
}

async function oneSpanMultipartFormDataRequest({ method, route, documents, data, apiKey, sandbox }) {
  try {
    const response = await request({
      method,
      uri: getRoute({
        route,
        sandbox
      }),
      headers: {
        Authorization: getAuthorization(apiKey),
        Accept: 'application/json',
        'Content-Type': `multipart/form-data; boundary=${Buffer.from(String(new Date().getTime())).toString('hex')}`
      },
      preambleCRLF: false,
      postambleCRLF: true,
      multipart: _.concat(
        documentsToMultipart(documents),
        dataToMultipart(data)
      )
    });
    return _.isString(response) ? safeJsonParse(response) : response;
  } catch (e) {
    throw new APIError(_.get(e, 'message', e));
  }
}

function oneSpanPDFRequest({ method, uri, apiKey, sandbox }) {
  throw new NotImplementedError();
}

exports.oneSpanRequest = oneSpanRequest;
exports.oneSpanMultipartFormDataRequest = oneSpanMultipartFormDataRequest;
exports.oneSpanPDFRequest = oneSpanPDFRequest;