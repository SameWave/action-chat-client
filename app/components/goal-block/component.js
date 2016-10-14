import Ember from 'ember';
import SwipableListItemMixin from 'action-chat-client/mixins/swipable-list-item';

const {
  Component,
  observer
} = Ember;

const SingleOptionWidth = 64;

export default Component.extend(SwipableListItemMixin, {
  classNames: ['c-media-block--goal'],
  classNameBindings: ['isActive', 'hasOneOption', 'hasThreeOptions'],

  // Passed In
  goal: null,
  value: 0,
  goalTotal: 100,
  colour: 'green',
  isActive: false,
  isEditing: false,

  optionWidth: SingleOptionWidth * 3,
  hasOneOption: false,
  hasThreeOptions: true,

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
  },

  setOptionWidth: observer('isEditing', function() {
    if (this.get('isEditing')) {
      this.setProperties({
        optionWidth: SingleOptionWidth,
        hasOneOption: true,
        hasThreeOptions: false
      });
    } else {
      this.setProperties({
        optionWidth: SingleOptionWidth * 3,
        hasOneOption: false,
        hasThreeOptions: true
      });
    }
  }),

  observePanOpen: observer('isPanOpen', function() {
    return this.get('isPanOpen') ? this.set('isEditingDisabled', true) : this.set('isEditingDisabled', false);
  })
});