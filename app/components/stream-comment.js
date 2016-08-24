import Ember from 'ember';

export default Ember.Component.extend({
  comment: null,
  isEditing: false,

  actions: {

    doEdit() {
      this.set('isEditing', true);
    },

    doUpdate() {
      this.set('isEditing', false);
      if (this.get('updateComment')) {
        this.get('updateComment')(this.get('comment'));
      }
    },

    doDelete() {
      if (this.get('deleteComment')) {
        this.get('deleteComment')(this.get('comment'));
      }
    }
  }
});