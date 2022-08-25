var fs = require('fs');
var path = require('path');

// Container for module (to be exported)
var lib = {};

// Base directory of data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = function (dir, file, data, callback) {
  fs.mkdir(lib.baseDir + dir + '/', function (err) {
    if (!err) {
      fs.open(
        lib.baseDir + dir + '/' + file + '.json',
        'wx',
        function (err, fileDescriptor) {
          if (!err && fileDescriptor) {
            var stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, function (err) {
              if (!err) {
                fs.close(fileDescriptor, function (err) {
                  if (!err) {
                    callback(false);
                  } else {
                    callback('Error closing new file');
                  }
                });
              } else {
                callback('Error writing to new file');
              }
            });
          } else {
            console.log(baseDir);
            callback('Could not create new file x, it may already exist');
          }
        }
      );
    } else {
      callback('Could not create new dir, it may already exist');
    }
  });
};

// exports the lib object
module.exports = lib;
