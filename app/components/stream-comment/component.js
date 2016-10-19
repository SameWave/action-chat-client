import Ember from 'ember';
import SwipableListItemMixin from 'action-chat-client/mixins/swipable-list-item';
import InViewportMixin from 'ember-in-viewport';

const {
  Component,
  computed,
  computed: {
    not
  }
} = Ember;

export default Component.extend(SwipableListItemMixin, InViewportMixin, {

  classNames: ['js-stream-comment', 'l-stream-comment', 'l-stream-comment--message'],
  classNameBindings: ['isEditing'],
  attributeBindings: ['style'],
  comment: null,
  firstUnread: null,
  lastComment: null,
  editingComment: null,

  isSwipable: not('isEditing'),
  isViewable: true,

  init() {
    // set elementId first as it's needed in super
    this.set('elementId', `comment-${this.get('comment.id')}`);
    this._super(...arguments);
  },

  style: computed('$height', function() {
    return (`min-height: ${this.$height}px`).htmlSafe();
  }),

  didInsertElement() {
    this._super(...arguments);

    this.set('$height', this.element.scrollHeight);

    this.setProperties({
      viewportEnabled: true,
      viewportUseRAF: true,
      viewportSpy: true,
      viewportScrollSensitivity: 1,
      viewportRefreshRate: 60,
      viewportTolerance: {
        top: 500,
        bottom: 500,
        left: 400,
        right: 400
      }
    });

    this.set('isViewable', false);
  },

  didEnterViewport() {
    this.set('isViewable', true);
  },

  didExitViewport() {
    this.set('isViewable', false);
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
      this.closeItem();

      if (this.get('onEdit')) {
        this.get('onEdit')(this.get('comment'));
      }
    },

    doDelete() {
      this.closeItem();

      if (this.get('onDelete')) {
        this.get('onDelete')(this.get('comment'));
      }
    },

    doCancel() {
      this.get('comment').rollbackAttributes();
    }
  }
});