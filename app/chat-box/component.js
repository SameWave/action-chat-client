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

      if (Ember.isEmpty(this.get('comment'))) {
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