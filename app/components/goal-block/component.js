import Ember from 'ember';
import SwipableListItemMixin from 'action-chat-client/mixins/swipable-list-item';

const {
  Component
} = Ember;

export default Component.extend(SwipableListItemMixin, {
  classNames: ['c-media-block--goal'],
  classNameBindings: ['isActive'],

  goal: null,
  value: 0,
  goalTotal: 100,
  colour: 'green',

  isActive: false,

  optionWidth: 64,

  touchStart(event) {
    let target = event.target.closest('[data-drag="handle"]');

    if (target) {
      this.set('isActive', true);
    }
  },

  touchMove() {
    this.set('isActive', false);
  },

  touchEnd() {
    this.set('isActive', false);
  },

  touchCancel() {
    this.set('isActive', false);
  }

});