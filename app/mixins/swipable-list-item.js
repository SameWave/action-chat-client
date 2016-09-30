import Ember from 'ember';

export default Ember.Mixin.create({

  classNameBindings: ['isOpen'],

  isOpen: false,

  init() {
    this._super(...arguments);

    if (this.get('doListRegister')) {
      this.get('doListRegister')(this);
    }
  },

  doSwipeLeft() {
    if (!this.get('isEditing')) {
      this.set('isOpen', true);
    }
  },

  doSwipeRight() {
    if (!this.get('isEditing')) {
      this.set('isOpen', false);
    }
  },

});