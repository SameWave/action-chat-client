import Ember from 'ember';

const {
  Component,
  run,
  isEmpty
} = Ember;

export default Component.extend({
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
    onTap() {
      // Trigger blur then focus after delay so that cursor appears inside input
      // run.later(this, () => {
      //   this.$input.blur().focus();

      // let focusedElement = this.$input[0];
      // let selStart = focusedElement.selectionStart,
      //   selEnd = focusedElement.selectionEnd;

      // focusedElement.selectionStart = 0;
      // focusedElement.selectionEnd = 0;

      // run.later(this, () => {
      //   focusedElement.selectionStart = selStart;
      //   focusedElement.selectionEnd = selEnd;
      // }, 33);

      // }, 420);
    },

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