import Ember from 'ember';
import ENV from 'action-chat-client/config/environment';

const {
  inject: {
    service
  },
  on,
  run,
  computed,
  isEmpty
} = Ember;

const NUDGE_OFFSET_PX = 60; // Pixels for determining nudge vs scroll for new comment
const NUDGE_PX = 24; // Pixels for distance to nudge

export default Ember.Controller.extend({

  cable: service(),

  user: null,
  comments: [],
  people: [],
  commentsElement: null,
  commentsSubscription: null,
  streamsSubscription: null,
  isLoadingEarlier: false,
  isKeyboardOpen: false,

  setup: on('init', function() {
    this.subscribeComments();
    this.subscribeStreams();

    run.schedule('afterRender', this, function() {
      this.commentsElement = $('.section-body');
      this.keyboardElement = $('.keyboard');
      this.scrollToBottom();

      if (window.Keyboard) {
        // window.Keyboard.shrinkView(true);
      }
      if (window.cordova && window.cordova.plugins.Keyboard) {
        this.setupKeyboardEvents();
      }
    });

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
    let scrollHeight = this.commentsElement.get(0).scrollHeight;

    this.keyboardElement.css({
      'height': `${height}px`
    });

    // We need a run later so that scrollTop is only set after keyboard shows
    run.later(this, () => {
      this.commentsElement.scrollTop(scrollHeight + height);

      this.commentsElement.animate({
        scrollTop: scrollHeight + height
      }, 100);
    }, 120);
  },

  hideKeyboard() {
    this.keyboardElement.css({
      'height': 0
    });
  },

  // For development only
  isKeyboardDidChange: Ember.observer('isKeyboardOpen', function() {
    if (this.get('isKeyboardOpen')) {
      let height = 216; // iPhone 5 keyboard height
      this.showKeyboard(height);
    } else {
      this.hideKeyboard();
    }
  }),

  subscribeComments() {
    var consumer = this.get('cable').createConsumer(ENV.socket);
    var subscription = consumer.subscriptions.create("CommentsChannel", {
      received: (data) => {
        let comment = this.store.peekRecord('comment', data.comment.id);
        if (isEmpty(comment)) {
          if (data.action === 'created') {

            let bottomOffset = this.bottomOffset();

            this.pushComment(data.comment);

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
      }
    });

    this.set('commentsSubscription', subscription);
  },

  subscribeStreams() {
    var consumer = this.get('cable').createConsumer(ENV.socket);
    var subscription = consumer.subscriptions.create("StreamsChannel", {
      received: (data) => {
        let person = this.get('people').findBy('id', data.member.person_id);
        if (person.get('id') !== this.get('user.id')) {
          person.setTypingAt(new Date(data.member.typing_at));
        }
      }
    });

    this.set('streamsSubscription', subscription);
  },

  typers: computed.filterBy('people', 'isTyping'),

  typingNotice: computed('typers.[]', function() {
    let people = this.get('typers').mapBy('name');
    switch (people.get('length')) {
      case 0:
        return '';
      case 1:
        return people.objectAt(0) + ' is typing ...';
      case 2:
        return people.objectAt(0) + ' and ' + people.objectAt(1) + ' are typing...';
      case 3:
        return people.objectAt(0) + ', ' + people.objectAt(1) + ' and 1 other are typing...';
      default:
        return people.objectAt(0) + ', ' + people.objectAt(1) + ' and ' + (people.get('length') - 2) + ' others are typing...';
    }
  }),

  isNoticeVisible: computed('isLoadingEarlier', 'typingNotice', function() {
    return this.get('isLoadingEarlier') || this.get('typingNotice.length');
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
              'id': data.person_id
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
    let scrollHeight = this.commentsElement.get(0).scrollHeight;
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

  actions: {
    createComment(body) {
      let newId = 1 + parseInt(this.get('comments').mapBy('id').get('lastObject'));

      let comment = this.store.createRecord('comment', {
        body: body,
        person: this.get('user'),
        id: newId
      });

      // Scroll to bottom so that new comment is visible
      run.next(this, this.scrollToBottom);

      this.get('commentsSubscription').send({
        comment: {
          body: comment.get('body'),
          person_id: comment.get('person.id')
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
      this.set('isLoadingEarlier', true);

      let initialHeight = this.commentsElement.get(0).scrollHeight;
      let initialTop = this.commentsElement.scrollTop();

      this.store.query('comment', {
        offset: this.get('comments.length')
      }).then(() => {
        run.next(this, function() {
          let newHeight = this.commentsElement.get(0).scrollHeight;
          let newTop = newHeight - initialHeight + initialTop;

          this.commentsElement.animate({
            scrollTop: newTop
          }, 250);
        });

        this.set('isLoadingEarlier', false);
      });

    },

    doLogin(person) {
      this.set('user', person);
    },

    doTyping() {
      let typingAt = new Date();
      this.get('streamsSubscription').send({
        member: {
          person_id: this.get('user.id'),
          typing_at: typingAt
        }
      });
    }
  }
});