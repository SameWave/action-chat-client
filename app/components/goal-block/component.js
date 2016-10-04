import Ember from 'ember';
import SwipableListItemMixin from 'action-chat-client/mixins/swipable-list-item';

const {
	Component
} = Ember;

export default Component.extend(SwipableListItemMixin, {
  classNames: ['c-media-block--goal'],

  goal: null,
  value: 0,
  goalTotal: 100,
  colour: 'green'
});
