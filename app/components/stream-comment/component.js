import Ember from 'ember';
import SwipableListItemMixin from 'action-chat-client/mixins/swipable-list-item'
import InViewportMixin from 'ember-in-viewport';

const {
  Component,
  computed,
  computed: {
    not
  },
  setProperties,
  on
} = Ember;

export default Component.extend(InViewportMixin, SwipableListItemMixin, {

  classNames: ['js-stream-comment', 'l-stream-comment', 'l-stream-comment--message'],
  classNameBindings: ['isEditing'],
  comment: null,
  firstUnread: null,
  lastComment: null,
  selectedComment: null,

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

  isEditing: computed('selectedComment.id', 'comment.id', function() {
    return this.get('selectedComment.id') === this.get('comment.id');
  }),

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