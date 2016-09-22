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

  commentsElement: null,
  commentsSubscription: null,
  streamsSubscription: null,
  isLoadingEarlier: false,
  isKeyboardOpen: false,
  totalCommentCount: 0,
  newMessagesTop: 0,
  unreadCommentsLength: 0,

  didRender() {
    this._super(...arguments);

    this.commentsElement = $('.js-comments-section');
    this.$chatBox = $('.js-chat-box');
    this.$commentSpacer = $('.js-comment-spacer');
    this.scrollToBottom();

    if (window.Keyboard) {
      // window.Keyboard.shrinkView(true);
    }
    if (window.cordova && window.cordova.plugins.Keyboard) {
      this.setupKeyboardEvents();
    }

    this.showNewMessagesMarker();

  },

  keyboardPusherOptions: {
    duration: 100,
    easing: 'ease'
  },

  showNewMessagesMarker() {

    let lastReadAt = this.get('sessionMember.lastReadAt');

    let unreadComments = this.get('comments').sortBy('createdAt').filter((comment) => {
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

  isShowingAllComments: computed('totalCommentCount', 'comments.length', function() {
    return this.get('comments.length') >= this.get('totalCommentCount');
  }),

  receivedCommentsData(data) {
    let comment = this.store.peekRecord('comment', data.comment.id);
    if (isEmpty(comment)) {
      if (data.action === 'created') {

        let bottomOffset = this.bottomOffset();

        this.pushComment(data.comment);
        this.commentCountPlusPlus();

        run.next(this, this.nudgeOrScrollBottom, bottomOffset);
        run.next(this, this.vibrate);
      }
    } else {
      if (data.action === 'destroyed') {
        this.unloadComment(comment);
      } else {
        this.updateComment(comment, data.comment);
      }
    }
  },

  receivedMembersData(data) {
    let member = this.get('members').findBy('id', data.member.id);
    if (member && member.get('id') !== this.get('sessionMember.id')) {
      member.setTypingAt(new Date(data.member.typing_at));
    }
  },

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
    } = this.commentsElement.get(0);

    this.$chatBox.css({
      transform: `translateY(-${height}px)`
    });
    this.commentsElement.css({
      transform: `translateY(-${height}px)`
    });

    // TODO: Scroll to last comment
    // run.later(this, () => {
    //   this.commentsElement.animate({
    //     scrollTop: scrollHeight + height
    //   }, 200);
    // }, 300);
  },

  hideKeyboard() {
    this.$chatBox.css({
      transform: 'translateY(0)'
    });
    this.commentsElement.css({
      transform: 'translateY(0)'
    });
  },

  // For development only
  isKeyboardDidChange: observer('isKeyboardOpen', function() {
    if (this.get('isKeyboardOpen')) {
      let height = 216; // iPhone 5 keyboard height
      this.showKeyboard(height);
    } else {
      this.hideKeyboard();
    }
  }),

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
    this.commentsElement.animate({
      scrollTop: top
    }, 100);
  },

  scrollToBottom() {
    this.doScroll(this.commentsElement.get(0).scrollHeight);
  },

  nudgeBottom() {
    this.doScroll(this.commentsElement.scrollTop() + NUDGE_PX);
  },

  bottomOffset() {
    let sectionHeight = this.commentsElement.height() + 20; // TODO: 20 for margin?
    let {
      scrollHeight
    } = this.commentsElement.get(0);
    let scrollTop = this.commentsElement.scrollTop();

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
      // TODO: swap this out for ember-cli-velocity
      this.commentsElement.animate({
        scrollTop: this.get('newMessagesTop')
      }, DELAY, () => {
        this.send('setAllMessagesAsRead');
      });
    },

    setAllMessagesAsRead() {
      this.set('sessionMember.lastReadAt', moment().utc());
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

      this.get('commentsSubscription').send({
        comment: {
          id: comment.get('id'),
          body: comment.get('body'),
          person_id: comment.get('person.id'),
          stream_id: comment.get('stream.id')
        },
        action: 'create'
      });
    },

    updateComment(comment) {
      this.get('commentsSubscription').send({
        comment_id: comment.get('id'),
        comment: {
          body: comment.get('body'),
          person_id: comment.get('person.id')
        },
        action: 'update'
      });
    },

    deleteComment(comment) {
      this.unloadComment(comment);

      this.get('commentsSubscription').send({
        comment_id: comment.get('id'),
        action: 'destroy'
      });
    },

    loadEarlier() {
      this.setProperties({
        isLoadingEarlier: true,
        previousTop: this.commentsElement.get(0).scrollHeight + this.commentsElement.scrollTop()
      });

      this.store.query('comment', {
        limit: COMMENT_LOAD_SIZE,
        offset: this.get('comments.length'),
        stream_id: this.get('stream.id')
      }).then(() => {
        this.send('doneLoadingEarlier');
      });
    },

    doneLoadingEarlier() {
      run.next(this, function() {
        this.commentsElement.scrollTop(this.commentsElement.get(0).scrollHeight - this.get('previousTop'));
      });

      this.set('isLoadingEarlier', false);
    },

    doTyping() {
      let typingAt = new Date();
      this.get('membersSubscription').send({
        member: {
          stream_id: this.get('stream.id'),
          id: this.get('sessionMember.id'),
          typing_at: typingAt
        }
      });
    }
  }
});