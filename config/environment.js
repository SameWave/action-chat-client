/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'action-chat-client',
    environment: environment,
    rootURL: '',
    locationType: 'hash',

    contentSecurityPolicy: {
      'default-src': ["'none'"],
      'script-src': ["'self'"],
      'font-src': ["'self'"],
      'connect-src': ["'self'"],
      'img-src': ["'self'"],
      'style-src': ["'self'"],
      'media-src': ["'self'"]
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

    HOST: 'http://localhost:3000',
    SOCKET: 'ws://localhost:3000/cable'
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.contentSecurityPolicy['connect-src'] = ["'self'", "localhost:3000", "ws://localhost:3000"];
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
    ENV.contentSecurityPolicy['connect-src'] = ["'self'", "samewave-action-chat.herokuapp.com", "wss://samewave-action-chat.herokuapp.com"];
    ENV.HOST = 'http://samewave-action-chat.herokuapp.com';
    ENV.SOCKET = 'wss://samewave-action-chat.herokuapp.com/cable';
  }

  return ENV;
};