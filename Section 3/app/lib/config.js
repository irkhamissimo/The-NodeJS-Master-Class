var environments = {};

// Staging (default) environment
environments.staging = {
  'httpPort' : 4000,
  'httpsPort': 4001,
  'envName' : 'staging',
  'hashingSecret': 'thisIsSecret'
};

// Production environment
environments.production = {
  'httpPort' : 5000,
  'httpsPort': 5001,
  'envName' : 'production',
  'hashingSecret':'thisIsAlsoSecret'
};

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;



