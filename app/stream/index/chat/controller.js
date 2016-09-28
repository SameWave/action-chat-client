import Ember from 'ember';
import moment from 'moment';
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
  testing
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
  readComments: [],

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

  $inputElement: null,
  isLoadingEarlier: false,
  isKeyboardOpen: false,
  totalCommentCount: 0,

  isMentionListVisible: false,
  typingTimer: null,
  lastCharacterTyped: '',
  chatBoxValue: '',
  loadingTimer: null,
  isEditingComment: false,
  selectedComment: null,

  $comments: null,
  $chatBox: null,
  $input: null,

  didRender() {
    this._super(...arguments);

    this.$comments = $('.js-comments-section');
    this.$chatBox = $('.js-chat-box');
    this.$input = $('#chat-area');

    this.$comments.on('touchmove', run.bind(this, this.onCommentsScroll));
    this.$comments.on('scroll', run.bind(this, this.onCommentsScroll));

    this.scrollToBottom(0); // scroll to bottom with 0 delay

    this.set('unreadTop', this.getUnreadTop());

    if (window.Keyboard) {
      // window.Keyboard.shrinkView(true);
    }
    if (window.cordova && window.cordova.plugins.Keyboard) {
      this.setupKeyboardEvents();
    }
  },

  getUnreadTop() {
    let unreadComment = this.get('sortedComments').filter((comment) => {
      return comment.get('createdAt') > this.get('sessionMember.lastReadAt');
    }).get('firstObject');
    if (!isEmpty(unreadComment)) {
      let $unreadComment = this.$comments.find(`#comment-${unreadComment.get('id')}`);
      return $unreadComment.position().top + this.$comments.scrollTop();
    } else {
      return 0;
    }
  },

  onCommentsScroll() {
    if (!this.get('isShowingAllComments')) {
      this.loadingTimer = run.debounce(this, () => {
        if (this.$comments.scrollTop() < 10) {
          this.send('loadEarlier');
        }
      }, 20000, true);
    }
  },

  keyboardPusherOptions: {
    duration: 100,
    easing: 'ease'
  },

  setLastReadAt() {
    let lastReadAt = new Date();
    debug('setLastReadAt', lastReadAt);
    this.set('sessionMember.lastReadAt', lastReadAt);
    this.get('sessionMember').save();
  },

  isShowingAllComments: computed('totalCommentCount', 'streamComments.length', function() {
    return this.get('streamComments.length') >= this.get('totalCommentCount');
  }),

  // TODO: Hook into new comments and trigger scroll/nudge here
  // receivedCommentsData(data) {
  //   let comment = this.store.peekRecord('comment', data.comment.id);
  //   if (isEmpty(comment)) {
  //     if (data.action === 'created') {

  //       let bottomOffset = this.bottomOffset();

  //       this.pushComment(data.comment);
  //       this.commentCountPlusPlus();

  //       run.next(this, this.nudgeOrScrollBottom, bottomOffset);
  //       run.next(this, this.vibrate);
  //     }
  //   } else {
  //     if (data.action === 'destroyed') {
  //       this.unloadComment(comment);
  //     } else {
  //       this.updateComment(comment, data.comment);
  //     }
  //   }
  // },

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

    this.$chatBox.css({
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
    this.$chatBox.css({
      transform: 'translateY(0)'
    });
    this.$comments.css({
      transform: 'translateY(0)'
    });
  },

  // NOTE: For development only
  // isKeyboardDidChange: observer('isKeyboardOpen', function() {
  //   if (this.get('isKeyboardOpen')) {
  //     let height = 216; // iPhone 5 keyboard height
  //     this.showKeyboard(height);
  //   } else {
  //     this.hideKeyboard();
  //   }
  // }),

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
      this.nudgeBottom(100);
    } else {
      this.scrollToBottom(100);
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

  unreadOffScreenCount: computed('sessionMember.unreadCount', 'readComments.length', function() {
    return this.get('sessionMember.unreadCount') - this.get('readComments.length');
  }),

  hasUnreadOffScreenComments: computed.gt('unreadOffScreenCount', 0),

  actions: {

    doReadComment(comment) {
      this.get('readComments').pushObject(comment);
    },

    scrollToLastRead() {
      this.$comments.animate({
        scrollTop: this.get('unreadTop')
      }, 500, () => {
        this.setLastReadAt();
      });
    },

    setAllMessagesAsRead() {
      this.setLastReadAt();
    },

    chatBoxTapEvent(e) {
      let currentKeyCode = e.which;
      let currentCharacter = String.fromCharCode(currentKeyCode);
      let spaceKeycode = 32;

      if (this.get('lastCharacterTyped') === spaceKeycode && currentCharacter === '@' || this.get('chatBoxValue') === '' && currentCharacter === '@') {
        this.send('showMentionList');
      } else {
        this.send('hideMentionList');
      }

      this.set('lastCharacterTyped', currentKeyCode);
      this.typingTimer = run.throttle(this, () => {
        this.send('doTyping');
      }, 500);
    },

    showMentionList() {
      this.set('isMentionListVisible', true);
    },

    hideMentionList() {
      this.set('isMentionListVisible', false);
    },

    pickMentionMember(person) {
      this.set('isMentionListVisible', false);
      this.set('chatBoxValue', `${this.get('chatBoxValue')}${person.get('name')} `);
      this.$inputElement.focus();
    },

    tappedInput() {
      function refocus() {
        this.$chatBox.find('.c-auto-resize-textarea').blur().focus();
      }

      run.later(this, refocus, 300);
    },

    toggleNotifierVisibility() {
      this.set('isNotifierVisible', false);
    },

    createComment(body) {
      debug('createComment');

      let comment = this.store.createRecord('comment', {
        body,
        person: this.get('sessionMember.person'),
        stream: this.get('stream')
      });

      this.commentCountPlusPlus();

      // Scroll to bottom so that new comment is visible
      run.next(this, this.scrollToBottom);

      comment.save().then(() => {
        debug('comment created');
      });
    },

    editComment(comment) {
      this.setProperties({
        'selectedComment': comment,
        'isChatModalVisible': true,
        'chatBoxValue': comment.get('body')
      });
    },

    doCancelUpdateComment() {
      this.setProperties({
        'selectedComment': null,
        'chatBoxValue': '',
        'isChatModalVisible': false
      });
    },

    doUpdateComment() {
      this.set('selectedComment.body', this.get('chatBoxValue'));
      this.get('selectedComment').save().then(() => {
        this.setProperties({
          'selectedComment': null,
          'chatBoxValue': '',
          'isChatModalVisible': false
        });
        debug('comment updated');
      });
    },

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

    loadEarlier() {
      this.setProperties({
        isLoadingEarlier: true,
        previousTop: this.$comments.get(0).scrollHeight + this.$comments.scrollTop()
      });

      this.store.query('comment', {
        limit: COMMENT_LOAD_SIZE,
        offset: this.get('streamComments.length'),
        stream_id: this.get('stream.id')
      }).then(() => {
        this.send('doneLoadingEarlier');
      });
    },

    doneLoadingEarlier() {
      run.next(this, function() {
        this.$comments.scrollTop(this.$comments.get(0).scrollHeight - this.get('previousTop'));
      });

      this.set('isLoadingEarlier', false);
    },

    doTyping() {
      debug('controller doTyping');
      run.debounce(this, function() {
        let typingAt = new Date();
        this.set('sessionMember.typingAt', typingAt);
        this.get('sessionMember').save();
      }, 300);
    }
  }
});