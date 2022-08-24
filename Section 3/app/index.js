/* 
Primary file for the API
*/

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all requests with a string
const server = http.createServer(function (req, res) {
  // Get the url and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path from the url
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

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
      // Send the response
      res.end('Hello World\n');

      // Log the request path
      console.log('Request received with this payload: ', buffer);
    });
});

// Start the server on port 3000
server.listen(3000, function () {
  console.log('Server listening on port 3000');
});
