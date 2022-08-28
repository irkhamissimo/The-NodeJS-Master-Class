var config = require('./config');
var crypto = require('crypto');


var helpers = {};

helpers.parseJsonToObject = function(str) {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
}

helpers.hash = function(str) {
  if(typeof(str =='string')&& str.length > 0)  {
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash; 
  } else {
    return false;
  }
};

module.exports = helpers;