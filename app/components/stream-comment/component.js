import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

const {
  Component,
  computed,
  setProperties,
  on
} = Ember;

export default Component.extend(InViewportMixin, {

  classNames: ['js-stream-comment', 'js-list-item', 'l-stream-comment', 'l-stream-comment--message'],
  classNameBindings: ['isEditing', 'isOpen'],
  comment: null,
  firstUnread: null,
  lastComment: null,
  selectedComment: null,
  registerInList: null,
  isOpen: false,

  init() {
    this._super(...arguments);
    this.set('elementId', `comment-${this.get('comment.id')}`);

    // TODO: Move this into a swipable-item mixin that works alongside the swipable-list mixin
    if (this.get('registerInList')) {
      this.get('registerInList')(this);
    }
  },

  isFirstUnread: computed('firstUnread.id', 'comment.id', function() {
    return this.get('firstUnread.id') === this.get('comment.id');
  }),

  isLastComment: computed('lastComment.id', 'comment.id', function() {
    return this.get('lastComment.id') === this.get('comment.id');
  }),

  isEditing: computed('selectedComment.id', 'comment.id', function() {
    return this.get('selectedComment.id') === this.get('comment.id');
  }),

  doSwipeLeft() {
    if (!this.get('isEditing')) {
      this.set('isOpen', true);
    }
  },

  doSwipeRight() {
    if (!this.get('isEditing')) {
      this.set('isOpen', false);
    }
  },

  viewportOptionsOverride: on('didInsertElement', function() {
    setProperties(this, {
      viewportEnabled: true,
      viewportUseRAF: true,
      viewportSpy: false,
      viewportScrollSensitivity: 1,
      viewportRefreshRate: 150,
      viewportTolerance: {
        top: -(65 + 34), // height of header + tab menu
        bottom: 0,
        left: 0,
        right: 0
      }
    });
  }),

  didEnterViewport() {
    if (this.get('doReadComment')) {
      this.get('doReadComment')();
    }
    if (this.get('isLastComment') && this.get('doReadComments')) {
      this.get('doReadComments')();
    }
  },

  didExitViewport() {},

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