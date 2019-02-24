function testEmail({ firstName, lastName }) {
  return `onespansignopensource+${firstName}${lastName}@gmail.com`
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));s
}

exports.testEmail = testEmail;
exports.timeout = timeout;
