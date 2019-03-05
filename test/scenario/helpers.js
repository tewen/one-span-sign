function testEmail({ firstName, lastName }) {
  return `onespansignopensource+${firstName}${lastName}@gmail.com`
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  testEmail,
  timeout
};
