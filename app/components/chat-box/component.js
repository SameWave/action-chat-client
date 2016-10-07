import Ember from 'ember';

const {
  Component,
  run,
  isEmpty
} = Ember;

export default Component.extend({

  keyboard: Ember.inject.service('cordova/keyboard'),

  classNames: ['c-chat-box'],

  value: '',
  isSendButtonVisible: false,
  $input: null,

  didRender() {
    this._super(...arguments);
    this.$input = this.$('#chat-area');
  },

  willDestroyElement() {
    this._super(...arguments);
    this.$input = null;
  },

  actions: {
    doComment() {
      if (isEmpty(this.get('value'))) {
        return;
      }

      this.$input.focus();

      if (this.get('onComment')) {
        this.get('onComment')(this.get('value'));
      }
      this.set('value', '');
    }
  }
});