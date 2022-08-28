var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

// Container for module (to be exported)
var lib = {};

// Base directory of data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = function (dir, file, data, callback) {
  // let DIR_PATH = lib.baseDir + dir + file + '.json';
  let DIR_PATH = lib.baseDir + dir;

  fs.mkdir(DIR_PATH, { recursive: true }, function (err) {
    if (!err) {
      let newDir = DIR_PATH + '/' + file + '.json';
      fs.open(newDir, 'wx', function (err, fileDescriptor) {
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
          callback('Could not create new file, it may already exist');
        }
      });
    } else {
      callback('Could not create new dir, it may already exist');
    }
  });
};

// Read data from a file
lib.read = function (dir, file, callback) {
  fs.readFile(
    lib.baseDir + dir + '/' + file + '.json',
    'utf8',
    function (err, data) {
      if (!err && data) {
        var parsedData = helpers.parseJsonToObject(data);
        callback(err, parsedData);
      } else {
        callback(err, data);
      }
    }
  );
};

// Update data in a file
lib.update = function (dir, file, data, callback) {
  fs.open(
    lib.baseDir + dir + '/' + file + '.json',
    'r+',
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        var stringData = JSON.stringify(data);
        fs.ftruncate(fileDescriptor, function (err) {
          if (!err) {
            fs.writeFile(fileDescriptor, stringData, function (err) {
              if (!err) {
                fs.close(fileDescriptor, function (err) {
                  if (!err) {
                    callback(false);
                  } else {
                    callback('Error closing existing file');
                  }
                });
              } else {
                callback('Error writing to existing file');
              }
            });
          } else {
            callback('Error truncating file');
          }
        });
      } else {
        callback('Could not open file for updating, it may not exist yet');
      }
    }
  );
};

// Delete a file
lib.delete = function (dir, file, callback) {
  fs.unlink(lib.baseDir + dir + '/' + file + '.json', function (err) {
    if (!err) {
      callback(false);
    } else {
      callback('Error deleting file');
    }
  });
};

// exports the lib object
module.exports = lib;
