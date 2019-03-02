const _ = require('lodash');

function safeJsonParse(obj) {
  if (obj && _.isString(obj)) {
    try {
      return JSON.parse(obj);
    } catch (e) {
      // Do nothing here
    }
  }
  return {};
}

function alwaysArray(val) {
  return _.isArray(val) ? val : [val];
}

function splitOrArray(val, delimeter) {
  return _.isString(val) ? val.split(delimeter || ',') : val;
}

exports.safeJsonParse = safeJsonParse;
exports.alwaysArray = alwaysArray;
exports.splitOrArray = splitOrArray;
