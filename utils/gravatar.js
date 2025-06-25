// utils/gravatar.js
const md5 = require('md5');

module.exports = function getGravatar(email) {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};
