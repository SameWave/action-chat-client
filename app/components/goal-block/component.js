import Ember from 'ember';
import SwipableListItemMixin from 'action-chat-client/mixins/swipable-list-item';

const {
  Component
} = Ember;

export default Component.extend(SwipableListItemMixin, {
  classNames: ['c-media-block--goal'],
  classNameBindings: ['isTouched'],

  goal: null,
  value: 0,
  goalTotal: 100,
  colour: 'green',

  isTouched: false,

  touchStart() {
    this.set('isTouched', true);
  },

  touchMove() {
    this.set('isTouched', false);
  },

  touchEnd() {
    this.set('isTouched', false);
  },

  touchCancel() {
    this.set('isTouched', false);
  },


});