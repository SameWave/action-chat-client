import Ember from 'ember';

const {
  Component
} = Ember;

export default Component.extend({
  comment: null,
  isEditing: false,

  init() {
    this._super(...arguments);

    this.set('elementId', `comment-${this.get('comment.id')}`);
  },

  actions: {
    doEdit() {
      this.set('isEditing', true);
    },

    doCancel() {
      this.get('comment').rollbackAttributes();
      this.set('isEditing', false);
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