import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

const {
  Component,
  setProperties,
  on,
  computed
} = Ember;

export default Component.extend(InViewportMixin, {

  classNames: ['c-stream-comment'],
  comment: null,
  firstUnread: null,
  isEditing: false,

  init() {
    this._super(...arguments);
    this.set('elementId', `comment-${this.get('comment.id')}`);
  },

  isFirstUnread: computed('firstUnread.id', 'comment.id', function() {
    return this.get('firstUnread.id') === this.get('comment.id');
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
  },

  didExitViewport() {},

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