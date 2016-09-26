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
  testing
} = Ember;

const NUDGE_OFFSET_PX = 60; // Pixels for determining nudge vs scroll for new comment
const NUDGE_PX = 24; // Pixels for distance to nudge
const COMMENT_LOAD_SIZE = 10;
const DELAY = testing ? 0 : 500;

export {
  COMMENT_LOAD_SIZE
};

export default Controller.extend({

  stream: null,
  sessionMember: null,
  members: [],
  comments: [],

  streamMembers: computed('members.[]', 'stream.id', function() {
    return this.get('members').filterBy('stream.id', this.get('stream.id'));
  }),

  streamComments: computed('comments.[]', 'stream.id', function() {
    return this.get('comments').filterBy('stream.id', this.get('stream.id'));
  }),

  isLoadingEarlier: false,
  isKeyboardOpen: false,
  totalCommentCount: 0,
  newMessagesTop: 0,
  unreadCommentsLength: 0,

  isMentionListVisible: false,
  typingTimer: null,
  lastCharacterTyped: '',
  currentComment: '',
  loadingTimer: null,

  $comments: null,
  $chatBox: null,
  $input: null,

  didRender() {
    this._super(...arguments);

    this.$comments = $('.js-comments-section');
    this.$chatBox = $('.js-chat-box');
    this.$input = $('#chat-area');
    this.$comments.on('touchmove', run.bind(this, this.commentsSectionScroll));
    this.$comments.on('scroll', run.bind(this, this.commentsSectionScroll));
    this.scrollToBottom();

    if (window.Keyboard) {
      // window.Keyboard.shrinkView(true);
    }
    if (window.cordova && window.cordova.plugins.Keyboard) {
      this.setupKeyboardEvents();
    }

    this.showNewMessagesMarker();
  },

  commentsSectionScroll() {
    if (!this.get('isShowingAllComments')) {
      this.loadingTimer = run.debounce(this, function() {
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

  showNewMessagesMarker() {

    let lastReadAt = this.get('sessionMember.lastReadAt');

    let unreadComments = this.get('streamComments').sortBy('createdAt').filter((comment) => {
      return comment.get('createdAt') > lastReadAt;
    });

    debug(`comments: ${this.get('comments.length')}`);
    debug(`unreadComments: ${unreadComments.get('length')}`);

    this.set('unreadCommentsLength', unreadComments.get('length'));

    if (unreadComments.get('length')) {

      let unreadCommentElement = $(`#comment-${unreadComments.get('firstObject.id')}`);
      let newMessagesTop = unreadCommentElement.position().top - 10;

      this.set('newMessagesTop', newMessagesTop);

    }
  },

  setLastReadAt() {
    // let lastReadAt = new Date();
    // Ember.debug('setLastReadAt', lastReadAt);

    // this.get('membersSubscription').send({
    //   member_id: this.get('sessionMember.id'),
    //   member: {
    //     last_read_at: lastReadAt
    //   },
    //   action: 'update'
    // });
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

  pushComment(data) {
    this.store.push({
      data: {
        id: data.id,
        type: 'comment',
        attributes: {
          body: data.body
        },
        relationships: {
          'person': {
            'data': {
              'type': 'person',
              'id': data.person.id
            }
          },
          'stream': {
            'data': {
              'type': 'stream',
              'id': data.stream.id
            }
          }
        }
      }
    });
  },

  updateComment(comment, data) {
    comment.set('body', data.body);
  },

  unloadComment(comment) {
    this.store.unloadRecord(comment);
  },

  doScroll(top) {
    this.$comments.animate({
      scrollTop: top
    }, 100);
  },

  scrollToBottom() {
    this.doScroll(this.$comments.get(0).scrollHeight);
  },

  nudgeBottom() {
    this.doScroll(this.$comments.scrollTop() + NUDGE_PX);
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

  isNotifierVisible: computed('sessionMember.lastReadAt', function() {
    // TODO: when all data is moment then remove this check
    let currentDate = moment.isMoment(this.get('sessionMember.lastReadAt')) ? this.get('sessionMember.lastReadAt') : moment(this.get('sessionMember.lastReadAt'));
    return currentDate.isBefore(moment().utc(), 'second');
  }),

  actions: {
    scrollToLastRead() {
      this.$comments.animate({
        scrollTop: this.get('newMessagesTop')
      }, DELAY, () => {
        this.send('setAllMessagesAsRead');
      });
    },

    setAllMessagesAsRead() {
      this.set('sessionMember.lastReadAt', moment().utc());
    },

    chatBoxTapEvent(e) {
      let currentKeyCode = e.which;
      let currentCharacter = String.fromCharCode(currentKeyCode);
      let spaceKeycode = 32;

      if (this.get('lastCharacterTyped') === spaceKeycode && currentCharacter === '@' || this.get('currentComment') === '' && currentCharacter === '@') {
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

      this.set('currentComment', `${this.get('currentComment')}${person.get('name')} `);
      this.$input.focus();
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