import Ember from 'ember';
import ENV from 'action-chat-client/config/environment';

const {
  Component,
  run,
  isEmpty
} = Ember;

export default Component.extend({
  classNames: ['c-chat-box'],

  value: '',
  $input: null,
  typingTimer: null,
  isKeyboardOpen: false,

  didRender() {
    this._super(...arguments);
    this.$input = this.$('#chat-area');
  },

  willDestroyElement() {
    this._super(...arguments);
    this.$input = null;
    run.cancel(this.typingTimer);
  },

  actions: {
    tapInput() {
      run.later(this, () => {
        this.$input.blur().focus();
      }, 350);
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