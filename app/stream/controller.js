import Ember from 'ember';

export default Ember.Controller.extend({

  cable: Ember.inject.service(),

  comments: [],

  setupSubscription: Ember.on('init', function() {
    var consumer = this.get('cable').createConsumer('ws://localhost:3000/cable');

    var subscription = consumer.subscriptions.create("CommentsChannel", {
      received: (data) => {
        this.addComment(data.comment);
      }
    });

    this.set('subscription', subscription);
  }),

  addComment(comment) {
    this.store.push({
      data: {
        id: comment.id,
        type: 'comment',
        attributes: {
          body: comment.body
        }
      }
    });
  },

  actions: {
    doComment() {
      this.get('subscription').send({
        body: this.get('body')
      });
    }
  }
});