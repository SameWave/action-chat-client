import Ember from 'ember';

const {
  Component,
  run,
  computed,
  isEmpty
} = Ember;

export default Component.extend({
  classNames: ['c-chat-box'],
  classNameBindings: ['isChatCarrotInvisible'],
  value: '',
  isSendButtonVisible: false,
  isChatCarrotVisible: false,
  isChatCarrotInvisible: computed.not('isChatCarrotVisible'),
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
        console.log('tap');
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