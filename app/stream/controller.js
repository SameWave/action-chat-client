import Ember from 'ember';
import ENV from 'action-chat-client/config/environment';

const {
  inject: {
    service
  },
  on,
  run,
  isEmpty
} = Ember;

const NUDGE_OFFSET_PX = 40; // Pixels for determining nudge vs scroll for new comment
const NUDGE_PX = 24; // Pixels for distance to nudge

export default Ember.Controller.extend({

  cable: service(),

  user: null,
  comments: [],
  commentsElement: null,

  setupSubscription: on('init', function() {

    var consumer = this.get('cable').createConsumer(ENV.SOCKET);
    var subscription = consumer.subscriptions.create("CommentsChannel", {
      received: (data) => {
        let comment = this.store.peekRecord('comment', data.comment.id);

        if (comment === null) {
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

    this.set('subscription', subscription);
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

  scrollToBottom() {
    // TODO: This should be set on render when we move into a component
    if (isEmpty(this.commentsElement)) {
      this.commentsElement = $('#comments');
    }
    this.commentsElement.scrollTop(this.commentsElement.get(0).scrollHeight);
  },

  nudgeBottom() {
    if (isEmpty(this.commentsElement)) {
      this.commentsElement = $('#comments');
    }

    // TODO: This should be set on render when we move into a component
    this.commentsElement.scrollTop(this.commentsElement.scrollTop() + NUDGE_PX);
  },

  bottomOffset() {
    if (isEmpty(this.commentsElement)) {
      this.commentsElement = $('#comments');
    }

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

      this.get('subscription').send({
        comment: {
          body: comment.get('body'),
          person_id: comment.get('person.id')
        },
        action: 'create'
      });

    },

    updateComment(comment) {
      this.get('subscription').send({
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

      this.get('subscription').send({
        comment_id: comment.get('id'),
        action: 'destroy'
      });
    },

    loadEarlier() {
      this.store.query('comment', {
        offset: this.get('comments.length')
      });
    },

    doLogin(person) {
      this.set('user', person);
    }
  }
});