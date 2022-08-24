/* 
Primary file for the API
*/

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// The server should respond to all requests with a string
const server = http.createServer(function (req, res) {
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
        typeof router[trimmedPath] !== 'undefined'
          ? router[trimmedPath]
          : handlers.notFound;

      // Construct the data object to send to the handler
      var data = {
        trimmedPath: trimmedPath,
        queryStringObject: queryStringObject,
        method: method,
        headers: headers,
        payload: buffer,
      };
      // Route the request to the handler specified in the router
      chosenHandler(data, function (statusCode, payload) {
        // Use the status code returned from the handler, or set the default status code to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        // Use the payload returned from the handler, or set the default payload to an empty object
        payload = typeof(payload) == 'object' ? payload : {};

        // Convert the payload to a string
        var payloadString = JSON.stringify(payload);

        // Return the response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
        console.log('Returning this response: ', statusCode, payloadString);
      });
    });
});

// Start the server 
server.listen(config.port , function () {
  console.log('Server listening on port: ', config.port + ' on mode: ' + config.envName);
});

// Define the handlers
var handlers = {};

// sample handler
handlers.sample = function (data, callback) {
  callback(406, { name: 'sample handler' });
};

// notFound handler
handlers.notFound = function (data, callback) {
  callback(404);
};

// Define the router
var router = {
  sample: handlers.sample,
};
