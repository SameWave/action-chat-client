import Ember from 'ember';

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

  comments: [],

  sortProperties: ['id'],
  sortedComments: sort('comments', 'sortProperties'),

  setupSubscription: on('init', function() {
    var consumer = this.get('cable').createConsumer('ws://localhost:3000/cable');

    var subscription = consumer.subscriptions.create("CommentsChannel", {
      received: (data) => {
        this.addComment(data);
      }
    });

    this.set('subscription', subscription);
  }),

  addComment(data) {
    let comment = this.store.push({
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
      this.get('subscription').send({
        body: this.get('body')
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