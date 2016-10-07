import Ember from 'ember';

const {
  Component,
  run,
  computed,
  isEmpty
} = Ember;

export default Component.extend({
  classNames: ['c-chat-box'],
  classNameBindings: ['isChatCaretInvisible'],
  value: '',
  isSendButtonVisible: false,
  isChatCaretVisible: false,
  isChatCaretInvisible: computed.not('isChatCaretVisible'),
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
    doTap() {
      run.later(this, () => {
        this.$input.blur().focus();
      }, 420);
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