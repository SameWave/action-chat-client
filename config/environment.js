/* jshint node: true */

module.exports = function(environment) {
  var ENV = { // eslint-disable-line no-var
    modulePrefix: 'action-chat-client',
    environment,
    rootURL: '',
    locationType: 'hash',

    contentSecurityPolicy: {
      'default-src': ["'none'"],
      'frame-src': ['gap:'],
      'script-src': ["'self'"],
      'font-src': ["'self'"],
      'connect-src': ["'self'"],
      'img-src': ["'self'"],
      'style-src': "'self' 'unsafe-inline'",
      'media-src': ["'self'"]
    },
    cordova: {
      reloadUrl: 'http://localhost:4200'
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    // Graeme's macbook
    // host: 'http://10.99.220.230:8080',
    // socket: 'ws://10.99.220.230:8080/cable'

    // Mondes's macbook
    // host: 'http://10.99.220.237:8080',
    // socket: 'ws://10.99.220.237:8080/cable'

    host: 'http://localhost:3000',
    socket: 'ws://localhost:3000/cable'
  };

  ENV['ember-simple-auth'] = {
    authorizer: 'authorizer:custom',
    routeAfterAuthentication: '/stream'
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.host = 'http://samewave-prototype.herokuapp.com';
    ENV.socket = 'wss://samewave-prototype.herokuapp.com/cable';
  }

  ENV.contentSecurityPolicy['connect-src'].push(ENV.host);
  ENV.contentSecurityPolicy['connect-src'].push(ENV.socket);

  return ENV;
};