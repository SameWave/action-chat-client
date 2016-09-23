import Ember from 'ember';
import ENV from 'action-chat-client/config/environment';

const {
  Component,
  run,
  isEmpty
} = Ember;

export default Component.extend({
  classNames: ['c-chat-box'],

  comment: '',
  inputElement: null,
  typingTimer: null,
  isKeyboardOpen: false,

  didRender() {
    this._super(...arguments);
    this.inputElement = this.$('#chat-area');
  },

  willDestroyElement() {
    this._super(...arguments);
    this.inputElement = null;
    run.cancel(this.typingTimer);
  },

  actions: {
    tapInput() {
      if (this.get('onTapInput')) {
        this.get('onTapInput')();
      }
    },

    doFocusIn() {
      if (ENV.environment === 'development') {
        this.set('isKeyboardOpen', true);
      }
    },

    doFocusOut() {
      if (ENV.environment === 'development') {
        this.set('isKeyboardOpen', false);
      }
    },

    doKeyDown(e) {
      if (this.get('onKeyDown')) {
        this.get('onKeyDown')(e);
      }
    },

    doKeyUp() {},

    doComment() {

      if (isEmpty(this.get('comment'))) {
        return;
      }

      this.inputElement.focus();

      if (this.get('doComment')) {
        this.get('doComment')(this.get('comment'));
      }
      this.set('comment', '');
    }
  }
});