import Ember from 'ember';
import SwipableListItemMixin from 'action-chat-client/mixins/swipable-list-item';

const {
  Component,
  observer,
  computed
} = Ember;

const OPTION_WIDTH = 64;

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

  optionsCount: 3,

  optionsWidth: computed('optionsCount', function() {
    return this.get('optionsCount') * OPTION_WIDTH;
  }),

  hasOneOption: computed.equal('optionsCount', 1),

  hasThreeOptions: computed.equal('optionsCount', 3),

  setOptionCount: observer('isEditing', function() {
    if (this.get('isEditing')) {
      this.set('optionsCount', 1);
    } else {
      this.set('optionsCount', 3);
    }
  }),

  observePanOpen: observer('isPanOpen', function() {
    return this.set('isEditingDisabled', this.get('isPanOpen'));
  }),

  didInsertElement() {
    this._super(...arguments);

    // TODO: Move these event listeners to the container and delegate to the item?
    this.$().on('touchstart', this.touchStart.bind(this));
    this.$().on('touchmove', this.touchCancel.bind(this));
    this.$().on('touchend', this.touchCancel.bind(this));
    this.$().on('touchcancel', this.touchCancel.bind(this));

  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().off('touchstart');
    this.$().off('touchmove');
    this.$().off('touchend');
    this.$().off('touchcancel');
  },

  touchStart(event) {
    let target = event.target.closest('[data-drag="handle"]');

    if (target) {
      this.set('isActive', true);
    }
  },

  touchCancel() {
    this.set('isActive', false);
  }
});