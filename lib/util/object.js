const _ = require('lodash');

function alwaysArray(val) {
  return _.isArray(val) ? val : [val];
}

function splitOrArray(val, delimeter) {
  return _.isString(val) ? val.split(delimeter || ',') : val;
}

module.exports = {
  alwaysArray,
  splitOrArray
};
