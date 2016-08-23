import Ember from 'ember';
import ENV from 'action-chat-client/config/environment';

const {
  inject: {
    service
  },
  computed: {
    sort
  },
  on
} = Ember;

export default Ember.Controller.extend({

  cable: service(),

  user: null,
  comments: [],

  sortProperties: ['id'],
  sortedComments: sort('comments', 'sortProperties'),

  setupSubscription: on('init', function() {
    var consumer = this.get('cable').createConsumer(ENV.SOCKET);
    var subscription = consumer.subscriptions.create("CommentsChannel", {
      received: (data) => {
        let comment = this.store.peekRecord('comment', data.comment.id);

        if (data.action === 'created') {
          if (comment) {
            this.updateComment(comment, data.comment);
          } else {
            this.pushComment(data.comment);
          }
        } else if (data.action === 'destroyed' && comment) {
          this.unloadComment(comment);
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

  actions: {
    createComment() {

      let newId = 1 + parseInt(this.get('comments.lastObject.id'));

      let comment = this.store.createRecord('comment', {
        body: this.get('body'),
        person: this.get('user'),
        id: newId
      });

      this.get('subscription').send({
        comment: {
          body: comment.get('body'),
          person_id: comment.get('person.id')
        },
        action: 'create'
      });

      this.set('body', '');
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