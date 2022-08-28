/* 
Primary file for the API
*/

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const fs = require('fs');
const _data = require('./lib/data');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');

// TESTING
// _data.create('things', 'gonna', { 'be': 'okay' }, function (err) {
//   if (!err) {
//     console.log('Success');
//   } else {
//     console.log('Error', err);
//   }
// });

// _data.read('files', 'test2', function (err, data) {
//   if (!err && data) {
//     console.log('this was the error: ', err, 'and this is the data: ', data);
//   } else {
//     console.log(err);
//   }
// });

// _data.update('users', 'test1', { name: 'oke' }, function (err) {
//   if (!err) {
//     console.log('Success');
//   } else {
//     console.log('Error', err);
//   }
// });

// _data.delete('users', 'test1', function (err) {
//   if (!err) {
//     console.log('Success');
//   } else {
//     console.log('Error', err);
//   }
// });

// instantiate http server
const httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res);
});

// starting http server
httpServer.listen(config.httpPort, function () {
  console.log(
    'Server listening on port: ',
    config.httpPort + ' on mode: ' + config.envName
  );
});

// instantiating https server
// https server options
var httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
};

const httpsServer = https.createServer(httpsServerOptions, function (req, res) {
  unifiedServer(req, res);
});

// starting https server
httpsServer.listen(config.httpsPort, function () {
  console.log(
    'Server listening on port: ',
    config.httpsPort + ' on mode: ' + config.envName
  );
});

// Define the request router
var unifiedServer = function (req, res) {
  // Get the url and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path from the url
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;
  // console.log(queryStringObject);

  // Get the HTTP method
  var method = req.method.toLowerCase();

  //  Get the headers
  var headers = req.headers;

  // Get the payload,if any
  var decoder = new StringDecoder('utf-8');

  var buffer = '';
  req
    .on('data', function (data) {
      buffer += decoder.write(data);
    })
    .on('end', function () {
      buffer += decoder.end();

      // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
      var chosenHandler =
        typeof (router[trimmedPath]) !== 'undefined'
          ? router[trimmedPath]
          : handlers.notFound;

      // Construct the data object to send to the handler
      var data = {
        trimmedPath: trimmedPath,
        queryStringObject: queryStringObject,
        method: method,
        headers: headers,
        payload: helpers.parseJsonToObject(buffer),
      };

      // Route the request to the handler specified in the router
      chosenHandler(data, function (statusCode, payload) {
        // Use the status code returned from the handler, or set the default status code to 200
        statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

        // Use the payload returned from the handler, or set the default payload to an empty object
        payload = typeof (payload) == 'object' ? payload : {};

        // Convert the payload to a string
        var payloadString = JSON.stringify(payload);

        // Return the response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
        console.log(trimmedPath, statusCode);
      });
    });
};

// Define the router
var router = {
  ping: handlers.ping,
  users: handlers.users,
};
