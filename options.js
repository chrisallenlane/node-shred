var shelly = require('shelly');

module.exports = function(params) {

  // assemble the command-line options
  var options     = [];
  var validParams = [
    'help',
    'version',
    'force',
    'remove',
    'verbose',
    'exact',
    'zero',
  ];

  validParams.forEach(function(param) {
    if (params[param] === true) {
      options.push('--' + param);
    }
  });

  if (params.iterations) {
    options.push(shelly('--iterations=?', params.iterations));
  }

  if (params.randomSource) {
    options.push(shelly('--random-source=?', params.randomSource));
  }

  if (params.size) {
    options.push(shelly('--size=?', params.size));
  }

  // alias `params.files` as `params.file`
  if (params.file) {
    params.files = params.file;
  }

  if (params.files) {
    params.files = (Array.isArray(params.files)) 
      ? params.files
      : [ params.files ] ;

    params.files.forEach(function(file) {
      options.push(shelly('?', file));
    });
  }

  return options;
};
