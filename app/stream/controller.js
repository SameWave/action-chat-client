import Ember from 'ember';
const {
  debug
} = Ember;

export default Ember.Controller.extend({

  cable: Ember.inject.service(),

  comments: [],

  setupSubscription: Ember.on('init', function() {
    var consumer = this.get('cable').createConsumer('ws://localhost:3000/cable');

    var subscription = consumer.subscriptions.create("CommentsChannel", {
      received: (data) => {
        this.get('comments').pushObject(data.comment);
      }
    });

    this.set('subscription', subscription);
  }),

  actions: {
    doComment() {
      this.get('subscription').send({
        body: this.get('body')
      });
    }
  }
})