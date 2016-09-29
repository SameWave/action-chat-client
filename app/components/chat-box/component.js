import Ember from 'ember';

const {
  Component,
  run,
  isEmpty
} = Ember;

export default Component.extend({
  classNames: ['c-chat-box'],

  value: '',
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
    onFocus() {
      // Trigger blur then focus after delay so that cursor appears inside input
      run.later(this, () => {
        this.$input.blur().focus();
      }, 420);
    },

    doKeyPress(e) {
      if (this.get('onKeyPress')) {
        this.get('onKeyPress')(e);
      }
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