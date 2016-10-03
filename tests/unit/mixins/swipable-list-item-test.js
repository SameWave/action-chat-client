import Ember from 'ember';
import SwipableListItemMixin from 'action-chat-client/mixins/swipable-list-item';
import { module, test } from 'qunit';

module('Unit | Mixin | swipable list item');

// Replace this with your real tests.
test('it works', function(assert) {
  let SwipableListItemObject = Ember.Object.extend(SwipableListItemMixin);
  let subject = SwipableListItemObject.create();
  assert.ok(subject);
});
