import Ember from 'ember';
import SetupSessionServiceInitializer from 'action-chat-client/initializers/setup-session-service';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | setup session service', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  SetupSessionServiceInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
