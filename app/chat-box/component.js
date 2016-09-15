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

  _resize() {
    let [textArea] = this.inputElement;

    textArea.style.cssText = 'height:auto; padding:0';
    textArea.style.cssText = `height:${textArea.scrollHeight}px`;
  },

  actions: {

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

    doKeyDown() {
      this.typingTimer = run.throttle(this, function() {
        this._resize();
        this.doTyping;
      }, 500);
    },

    doKeyUp() {},

    doTyping() {
      if (this.get('doTyping')) {
        this.get('doTyping')();
      }
    },

    doComment() {

      if (isEmpty(this.get('comment'))) {
        return;
      }

      this.inputElement.focus();

      if (this.get('doComment')) {
        this.get('doComment')(this.get('comment'));
      }
      this.set('comment', '');
      this._resize();
    }
  }
});