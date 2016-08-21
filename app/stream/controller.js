import Ember from 'ember';
const {
  debug
} = Ember;

export default Ember.Controller.extend({
  cable: Ember.inject.service(),

  setupConsumer: Ember.on('init', function() {

    var consumer = this.get('cable').createConsumer('ws://localhost:3000/cable');

    // consumer.subscriptions.create("CommentsChannel", {
    //   connected() {
    //     debug('connected');
    //     // this.perform('hello', {
    //     //   foo: 'bar'
    //     // });
    //     // this.perform('hello');
    //   },
    //   received(data) {
    //     debug("received(data) -> " + Ember.inspect(data));
    //     this.addComment(data);
    //   },
    //   disconnected() {
    //     debug("CommentsChannel#disconnected");
    //   }
    // });

    // Passing Parameters to Channel
    const subscription = consumer.subscriptions.create({
      channel: 'CommentsChannel'
    }, {
      received: (data) => {
        this.addComment(data.comment);
      }
    });

    // Send actions to your Action Cable channel class
    // subscription.perform("your_channel_action", {
    //   hey: "hello"
    // });
  }),

  comments: [],

  addComment(comment) {
    this.get('comments').pushObject(comment);
  }
})