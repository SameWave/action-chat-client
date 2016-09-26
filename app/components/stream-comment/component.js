import Ember from 'ember';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

const {
  Component
} = Ember;

export default Component.extend(RecognizerMixin, {
  classNames: ['js-stream-comment', 'l-stream-comment', 'l-stream-comment--message'],
  classNameBindings: ['isEditing', 'isOpen'],
  recognizers: 'tap swipe',
  comment: null,
  isEditing: false,
  isOpen: false,

  init() {
    this._super(...arguments);

    this.set('elementId', `comment-${this.get('comment.id')}`);
  },

  swipeLeft() {
    this.set('isOpen', true);
  },

  swipeRight() {
    this.set('isOpen', false);
  },

  actions: {
    doEdit() {
      this.set('isEditing', true);
      this.set('isOpen', false);

      if (this.get('onEdit')) {
        this.get('onEdit')(this.get('comment'));
      }
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