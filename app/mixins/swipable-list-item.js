import Ember from 'ember';

export default Ember.Mixin.create({

  classNames: ['js-list-item'],
  classNameBindings: ['isOpen'],

  isOpen: false,
  isSwipable: true,

  init() {
    this._super(...arguments);
    this.get('parentView').registerItem(this);
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