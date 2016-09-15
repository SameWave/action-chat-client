import Ember from 'ember';

export default Ember.Component.extend({
  comment: null,
  isEditing: false,

  setElementId: Ember.on('init', function() {
    this.set('elementId', 'comment-' + this.get('comment.id'));
  }),

  didRender() {
    Ember.debug('stream-comment didRender');
    this._super(...arguments);
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