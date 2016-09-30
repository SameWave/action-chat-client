import Ember from 'ember';

export default Ember.Mixin.create({

  classNameBindings: ['isOpen'],

  isOpen: false,
  registerInList: null,

  init() {
    this._super(...arguments);

    if (this.get('registerInList')) {
      this.get('registerInList')(this);
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