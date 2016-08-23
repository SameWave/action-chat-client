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
        let comment = this.store.peekRecord('comment', data.id);
        if (comment) {
          this.updateComment(comment, data);
        } else {
          this.addComment(data);
        }
      }
    });

    this.set('subscription', subscription);
  }),

  updateComment(comment, data) {
    comment.set('body', data.body);
  },

  addComment(data) {
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

  actions: {
    doComment() {

      let newId = 1 + parseInt(this.get('comments.lastObject.id'));

      let comment = this.store.createRecord('comment', {
        body: this.get('body'),
        person: this.get('user'),
        id: newId
      });

      this.get('subscription').send({
        body: comment.get('body'),
        person_id: comment.get('person.id')
      });

      this.set('body', '');
    },

    loadEarlier() {
      this.store.query('comment', {
        offset: this.get('comments.length')
      });
    }
  }
});