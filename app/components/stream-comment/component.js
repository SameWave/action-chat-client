import Ember from 'ember';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

const {
  Component,
  computed
} = Ember;

export default Component.extend(RecognizerMixin, {
  classNames: ['js-stream-comment', 'l-stream-comment', 'l-stream-comment--message'],
  classNameBindings: ['isEditing', 'isOpen'],
  recognizers: 'tap swipe',
  comment: null,
  selectedComment: null,
  isOpen: false,

  init() {
    this._super(...arguments);

    this.set('elementId', `comment-${this.get('comment.id')}`);
  },

  isEditing: computed('selectedComment.id', 'comment.id', function() {
    return this.get('selectedComment.id') === this.get('comment.id');
  }),

  swipeLeft() {
    if (!this.get('isEditing')) {
      this.set('isOpen', true);
    }
  },

  swipeRight() {
    if (!this.get('isEditing')) {
      this.set('isOpen', false);
    }
  },

  actions: {
    doEdit() {
      this.set('isOpen', false);

      if (this.get('onEdit')) {
        this.get('onEdit')(this.get('comment'));
      }
    },

    doCancel() {
      this.get('comment').rollbackAttributes();
    },

    doUpdate() {
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