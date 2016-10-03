import Ember from 'ember';

const {
  Mixin
} = Ember;

export default Mixin.create({

  classNames: ['js-list-item'],
  classNameBindings: ['isOpen'],

  isOpen: false,
  isSwipable: true,

  init() {
    this._super(...arguments);

    // Check that registerItem function exists on parentView
    if (this.get('parentView').registerItem) {
      this.get('parentView').registerItem(this);
    }
  },

  doSwipeLeft() {
    if (this.get('isSwipable')) {
      this.set('isOpen', true);
    }
  },

  doSwipeRight() {
    if (this.get('isSwipable')) {
      this.set('isOpen', false);
    }
  },

});