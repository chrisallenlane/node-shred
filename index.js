const options = require('./options');
const spawn   = require('child_process').spawn;

// this must be a constructor that constructs a stream
module.exports = function(params) {

  // set the default `shred` path
  var shredPath = params.shredPath || '/usr/bin/shred';

  // spawn the shred process
  const shred = spawn(shredPath, options(params));
  
  // NB: this is strictly for unit-testing purposes
  shred._shredPath = shredPath;

  // simplify the stream's interface
  shred.stdout.on('data', function(data) {
    shred.emit('data', data.toString().trim());
  });

  shred.stderr.on('error', function(err) {
    shred.emit('error', err.toString().trim());
  });

  shred.on('close', function(code) {
    shred.emit('end', code === 0);
  });

  // return the stream
  return shred;
};
