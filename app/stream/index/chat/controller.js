import Ember from 'ember';
import {
  animate
} from 'liquid-fire';
import ENV from 'action-chat-client/config/environment';

const {
  Controller,
  debug,
  $,
  observer,
  run,
  computed,
  isEmpty,
  inject,
  testing,
  computed: {
    alias
  },
  on
} = Ember;

const NUDGE_OFFSET_PX = 60; // Pixels for determining nudge vs scroll for new comment
const NUDGE_PX = 24; // Pixels for distance to nudge
const COMMENT_LOAD_SIZE = 10;

export {
  COMMENT_LOAD_SIZE
};

export default Controller.extend({

  session: inject.service(),

  stream: null,
  members: [],
  comments: [],
  previousCommentCount: 0,
  previousLastReadAt: null,
  unreadCount: 0,
  isObserving: false,
  isSendButtonVisible: true,
  isChatCarrotVisible: false,

  streamMembers: computed('members.[]', 'stream.id', function() {
    return this.get('members').filterBy('stream.id', this.get('stream.id'));
  }),

  streamComments: computed('comments.[]', 'stream.id', function() {
    return this.get('comments').filterBy('stream.id', this.get('stream.id'));
  }),

  sessionMember: computed('streamMembers.[]', 'session.person.id', function() {
    return this.get('streamMembers').findBy('person.id', this.get('session.person.id'));
  }),

  commentSortProperties: ['createdAt', 'id'],
  sortedComments: computed.sort('streamComments', 'commentSortProperties'),

  isLoadingEarlier: false,
  totalCommentCount: 0,

  isMentionListVisible: false,
  typingTimer: null,
  chatBoxValue: '',
  loadingTimer: null,
  editingComment: null,
  firstUnread: null,

  $comments: null,
  $footer: null,
  $input: null,

  didRender() {
    this._super(...arguments);

    this.set('isObserving', true);

    this.$comments = $('.js-comments-section');
    this.$footer = $('.js-footer');
    this.$input = $('#chat-area');

    this.scrollToBottom(0); // scroll to bottom with 0 delay

    this.$comments.on('touchmove', run.bind(this, this.onCommentsScroll));
    this.$comments.on('scroll', run.bind(this, this.onCommentsScroll));
    this.$footer.on('transitionend', run.bind(this, this.footerAnimationEnd));

    if (this.get('unreadCount')) {
      this.setFirstUnread();
    } else {
      this.setLastReadAt();
    }

    if (window.cordova && window.cordova.plugins.Keyboard) {
      this.setupKeyboardEvents();
    }
  },

  footerAnimationEnd() {
    this.set('isChatCarrotVisible', true);
  },

  commentCount: alias('streamComments.length'),

  commentCountObserver: observer('commentCount', function() {
    if (!this.get('isObserving')) {
      return;
    }
    if (!this.get('isLoadingEarlier') && this.get('previousCommentCount') < this.get('commentCount')) {
      this.newCommentAdded(this.get('streamComments.lastObject'));
    }
    this.set('previousCommentCount', this.get('commentCount'));
  }),

  newCommentAdded(comment) {
    let bottomOffset = this.bottomOffset();
    this.commentCountPlusPlus();
    if (comment.get('person.id') === this.get('session.person.id')) {
      run.next(this, this.scrollToBottom, bottomOffset);
    } else {
      run.next(this, this.nudgeOrScrollBottom, bottomOffset);
      run.next(this, this.vibrate);
    }

    if (!this.get('unreadCount')) {
      this.setLastReadAt();
    }
  },

  setFirstUnread() {
    let firstUnread = this.get('sortedComments').find((comment) => {
      return comment.get('createdAt') > this.get('previousLastReadAt');
    });
    this.set('firstUnread', firstUnread);
  },

  isNearTop() {
    return this.$comments.scrollTop() < 10;
  },

  onCommentsScroll() {
    if (!this.get('isShowingAllComments') && this.isNearTop() && !this.get('isLoadingEarlier')) {
      this.loadingTimer = run.debounce(this, this.loadEarlier, 1000, true);
    }
  },

  loadEarlier(count = COMMENT_LOAD_SIZE, callback) {

    this.setProperties({
      isLoadingEarlier: true,
      previousTop: this.$comments.get(0).scrollHeight + this.$comments.scrollTop()
    });

    this.store.query('comment', {
      limit: count,
      offset: this.get('streamComments.length'),
      stream_id: this.get('stream.id')
    }).then(() => {
      this.send('doneLoadingEarlier');
      if (callback) {
        callback();
      }
    });
  },

  isShowingAllComments: computed('totalCommentCount', 'streamComments.length', function() {
    return this.get('streamComments.length') >= this.get('totalCommentCount');
  }),

  setupKeyboardEvents() {
    let _this = this;

    window.addEventListener('native.keyboardshow', function(e) {
      _this.showKeyboard(e.keyboardHeight);
    });

    window.addEventListener('native.keyboardhide', function(e) {
      _this.hideKeyboard(e.keyboardHeight);
    });
  },

  showKeyboard(height) {
    if (window.cordova && window.cordova.platformId === 'android') {
      return;
    }

    let {
      scrollHeight
    } = this.$comments.get(0);

    this.$footer.css({
      transform: `translateY(-${height}px)`
    });
    this.$comments.css({
      transform: `translateY(-${height}px)`
    });

    // TODO: Scroll to last comment
    // run.later(this, () => {
    //   this.$comments.animate({
    //     scrollTop: scrollHeight + height
    //   }, 200);
    // }, 300);
  },

  hideKeyboard() {
    this.$footer.css({
      transform: 'translateY(0)'
    });
    this.$comments.css({
      transform: 'translateY(0)'
    });

    this.set('isChatCarrotVisible', false);
  },

  doScroll(top, delay) {
    this.$comments.animate({
      scrollTop: top
    }, delay);
  },

  scrollToBottom(delay = 100) {
    this.doScroll(this.$comments.get(0).scrollHeight, delay);
  },

  nudgeBottom(delay = 100) {
    this.doScroll(this.$comments.scrollTop() + NUDGE_PX, delay);
  },

  bottomOffset() {
    if (!this.$comments) {
      return 0;
    }

    let sectionHeight = this.$comments.height() + 20; // TODO: 20 for margin?
    let {
      scrollHeight
    } = this.$comments.get(0);
    let scrollTop = this.$comments.scrollTop();

    // NOTE: (total scroll height) - (height of section + 20 for margin) - (scrolled distance)
    return scrollHeight - sectionHeight - scrollTop;
  },

  nudgeOrScrollBottom(bottomOffset) {
    if (bottomOffset > NUDGE_OFFSET_PX) {
      this.nudgeBottom();
    } else {
      this.scrollToBottom();
    }
  },

  vibrate() {
    if (window.navigator) {
      window.navigator.vibrate(2000); // Note: Time is ignored on iOS
    }
  },

  commentCountPlusPlus() {
    this.set('totalCommentCount', this.get('totalCommentCount') + 1);
  },

  setLastReadAt() {
    let lastReadAt = new Date();
    debug('setLastReadAt', lastReadAt);
    this.set('sessionMember.lastReadAt', lastReadAt);
    this.get('sessionMember').save();
    this.set('unreadCount', 0);
  },

  scrollUpToComment(commentId) {
    let $comment = $(`#comment-${commentId}`);
    let extra = 15; // How much should we allow?
    this.$comments.animate({
      scrollTop: $comment.position().top + this.$comments.scrollTop() - extra
    }, 500);
  },

  scrollUpToLastRead() {
    this.scrollUpToComment(this.get('firstUnread.id'));
  },

  scrollToComment(commentId) {

    let offset = 30;
    let $comment = this.$comments.find(`#comment-${commentId}`);
    let newTop = 0;

    newTop += this.$comments.scrollTop();
    newTop += $comment.position().top;
    newTop -= this.$comments[0].clientHeight;
    newTop += $comment[0].clientHeight;
    newTop += offset;

    this.$comments.animate({
      scrollTop: newTop
    }, 500);

  },

  actions: {

    doCommentSectionTap() {
      if (isEmpty(this.get('editingComment'))) {
        this.$input.blur();
        this.hideMentionList();
      }
    },

    doNotifierJump() {
      let unfetchedCount = this.get('unreadCount') - this.get('streamComments.length');
      if (unfetchedCount > 0) {
        this.loadEarlier(unfetchedCount, () => {
          this.setFirstUnread();
          run.next(this, this.scrollToLastRead);
        });
      } else {
        this.scrollToLastRead();
      }
    },

    setAllMessagesAsRead() {
      this.setLastReadAt();
      this.set('previousLastReadAt', this.get('sessionMember.lastReadAt'));
    },

    doNewMarkerViewed() {
      this.setLastReadAt();
    },

    doValueChange(value) {
      if (value && value[value.length - 1] === '@') {
        this.set('isMentionListVisible', true);
      } else if (value) {
        this.typingTimer = run.throttle(this, () => {
          this.send('doTyping');
        }, 500);
      } else {
        this.set('isMentionListVisible', false);
      }
    },

    hideMentionList() {
      this.set('isMentionListVisible', false);
    },

    pickMentionMember(person) {
      this.set('isMentionListVisible', false);

      this.set('chatBoxValue', `${this.get('chatBoxValue')}${person.get('name')} `);
      this.$input.focus();
    },

    toggleNotifierVisibility() {
      this.set('isNotifierVisible', false);
    },

    createComment(body) {
      let comment = this.store.createRecord('comment', {
        body,
        person: this.get('sessionMember.person'),
        stream: this.get('stream')
      });
      comment.save().then(() => {
        debug('comment created');
      });
    },

    doEditComment(comment) {
      this.setProperties({
        editingComment: comment,
        isChatModalVisible: true,
        chatBoxValue: comment.get('body'),
        isSendButtonVisible: false
      });
      this.$input.focus();
      this.scrollToComment(comment.get('id'));

    },

    doCancelUpdateComment() {
      this.setProperties({
        editingComment: null,
        chatBoxValue: '',
        isChatModalVisible: false
      });
      this.$input.blur();
    },

    doUpdateComment() {
      this.set('editingComment.body', this.get('chatBoxValue'));
      this.get('editingComment').save().then(() => {
        this.setProperties({
          editingComment: null,
          chatBoxValue: '',
          isChatModalVisible: false,
          isSendButtonVisible: true
        });
      });
    },

    // TODO: Review this as it looks like a duplicate
    updateComment(comment) {
      comment.save().then(() => {
        debug('comment updated');
      });
    },

    deleteComment(comment) {
      comment.destroyRecord().then(() => {
        debug('comment destroyed');
      });
    },

    doLoadEarlier() {
      this.loadEarlier();
    },

    doneLoadingEarlier() {
      run.next(this, function() {
        this.$comments.scrollTop(this.$comments.get(0).scrollHeight - this.get('previousTop'));
      });

      this.set('isLoadingEarlier', false);
    },

    doTyping() {
      run.debounce(this, function() {
        let typingAt = new Date();
        this.set('sessionMember.typingAt', typingAt);
        this.get('sessionMember').save();
      }, 300);
    }
  }
});