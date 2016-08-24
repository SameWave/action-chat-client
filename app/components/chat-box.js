import Ember from 'ember';

export default Ember.Component.extend({

  comment: '',
  inputElement: null,

  didRender() {
    this._super(...arguments);
    this.inputElement = this.$('#chat-area');
  },

  actions: {
    doComment() {
      this.inputElement.focus();

      if (this.get('doComment')) {
        this.get('doComment')(this.get('comment'));
      }
      this.set('comment', '');
    }
  }
});