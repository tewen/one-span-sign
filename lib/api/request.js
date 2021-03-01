const _ = require("lodash");
const qs = require("qs");
const request = require("request-promise-native");
const { safeJsonParse } = require("deep-cuts");
const {
  getAuthorization,
  getRoute,
  documentsToMultipart,
  dataToMultipart,
} = require("./helpers/request");
const { APIError } = require("../util/error");

async function oneSpanRequest({
  method,
  route,
  query,
  body,
  apiKey,
  sandbox,
  domain,
  sandboxDomain,
}) {
  try {
    const response = await request({
      method,
      uri: _.chain([
        getRoute({
          route,
          sandbox,
          domain,
          sandboxDomain,
        }),
        !_.isEmpty(query) ? qs.stringify(query) : undefined,
      ])
        .compact()
        .join("?")
        .value(),
      json: true,
      body,
      headers: {
        Authorization: getAuthorization(apiKey),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return _.isString(response) ? safeJsonParse(response) : response;
  } catch (e) {
    throw new APIError(_.get(e, "message", e));
  }
}

async function oneSpanMultipartFormDataRequest({
  method,
  route,
  documents,
  data,
  apiKey,
  sandbox,
  domain,
  sandboxDomain,
}) {
  try {
    const response = await request({
      method,
      uri: getRoute({
        route,
        sandbox,
        domain,
        sandboxDomain,
      }),
      headers: {
        Authorization: getAuthorization(apiKey),
        Accept: "application/json",
        "Content-Type": `multipart/form-data; boundary=${Buffer.from(
          String(new Date().getTime())
        ).toString("hex")}`,
      },
      preambleCRLF: false,
      postambleCRLF: true,
      multipart: _.concat(
        documentsToMultipart(documents),
        dataToMultipart(data)
      ),
    });
    return _.isString(response) ? safeJsonParse(response) : response;
  } catch (e) {
    throw new APIError(_.get(e, "message", e));
  }
}

function oneSpanPDFRequest({
  method,
  route,
  query,
  apiKey,
  sandbox,
  domain,
  sandboxDomain,
}) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = [];
      await request({
        method,
        uri: _.chain([
          getRoute({
            route,
            sandbox,
            domain,
            sandboxDomain,
          }),
          !_.isEmpty(query) ? qs.stringify(query) : undefined,
        ])
          .compact()
          .join("?")
          .value(),
        responseType: "stream",
        headers: {
          Authorization: getAuthorization(apiKey),
          Accept: "application/pdf",
        },
      })
        .on("error", (err) => {
          reject(new APIError(_.get(err, "message", err)));
        })
        .on("data", (chunk) => {
          data.push(chunk);
        })
        .on("end", () => {
          data = Buffer.concat(data);
          resolve(data);
        });
      return data;
    } catch (e) {
      reject(new APIError(_.get(e, "message", e)));
    }
  });
}

module.exports = {
  oneSpanRequest,
  oneSpanMultipartFormDataRequest,
  oneSpanPDFRequest,
};
