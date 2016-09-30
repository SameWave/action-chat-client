import Ember from 'ember';
import SwipableListMixin from 'action-chat-client/mixins/swipable-list';
import { module, test } from 'qunit';

module('Unit | Mixin | swipable list');

// Replace this with your real tests.
test('it works', function(assert) {
  let SwipableListObject = Ember.Object.extend(SwipableListMixin);
  let subject = SwipableListObject.create();
  assert.ok(subject);
});
