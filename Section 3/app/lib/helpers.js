var config = require('./config');
var crypto = require('crypto');

var helpers = {};

helpers.parseJsonToObject = function (str) {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

helpers.hash = function (str) {
  if (typeof (str == 'string') && str.length > 0) {
    var hash = crypto
      .createHmac('sha256', config.hashingSecret)
      .update(str)
      .digest('hex');
    return hash;
  } else {
    return false;
  }
};

helpers.createRandomString = function (strLen) {
  if (typeof strLen == 'number' && strLen > 0) {
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';

    for (let i = 0; i < strLen; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }
};

module.exports = helpers;
