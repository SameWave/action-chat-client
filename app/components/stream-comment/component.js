import Ember from 'ember';
import SwipableListItemMixin from 'action-chat-client/mixins/swipable-list-item';

const {
  Component,
  computed,
  computed: {
    not
  }
} = Ember;

export default Component.extend(SwipableListItemMixin, {

  classNames: ['js-stream-comment', 'l-stream-comment', 'l-stream-comment--message'],
  classNameBindings: ['isEditing'],
  comment: null,
  firstUnread: null,
  lastComment: null,
  editingComment: null,

  isSwipable: not('isEditing'),

  init() {
    // set elementId first as it's needed in super
    this.set('elementId', `comment-${this.get('comment.id')}`);
    this._super(...arguments);
  },

  isFirstUnread: computed('firstUnread.id', 'comment.id', function() {
    return this.get('firstUnread.id') === this.get('comment.id');
  }),

  isLastComment: computed('lastComment.id', 'comment.id', function() {
    return this.get('lastComment.id') === this.get('comment.id');
  }),

  isEditing: computed('editingComment.id', 'comment.id', function() {
    return this.get('editingComment.id') === this.get('comment.id');
  }),

  actions: {
    doEdit() {
      this.set('isOpen', false);

      if (this.get('onEdit')) {
        this.get('onEdit')(this.get('comment'));
      }
    },

    doCancel() {
      this.get('comment').rollbackAttributes();
    }
  }
});