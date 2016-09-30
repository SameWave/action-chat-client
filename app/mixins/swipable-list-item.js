import Ember from 'ember';

export default Ember.Mixin.create({

  classNameBindings: ['isOpen'],

  isOpen: false,
  isSwipable: true,

  init() {
    this._super(...arguments);

    if (this.get('doListRegister')) {
      this.get('doListRegister')(this);
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