import Ember from 'ember';

const {
  run,
  isEmpty
} = Ember;

export default Ember.Component.extend({

  comment: '',
  inputElement: null,
  typingTimer: null,

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

    doKeyDown() {
      this.typingTimer = run.throttle(this, this.doTyping, 500);
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
    }
  }
});