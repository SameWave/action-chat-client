import Ember from 'ember';

export default Ember.Controller.extend({

  cable: Ember.inject.service(),

  comments: [],

  setupSubscription: Ember.on('init', function() {
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
        id: data.comment.id,
        type: 'comment',
        attributes: {
          body: data.comment.body
        }
      }
    });

    // Using #query in the model hook means we need to explicitly push into the array,
    // #findall automatically updates when a new record is pushed into the store
    this.get('comments').pushObject(comment._internalModel);
  },

  actions: {
    doComment() {
      this.get('subscription').send({
        body: this.get('body')
      });
      this.set('body', '');
    },

    loadEarlier() {
      this.set('limit', this.get('limit') + 10);

      let comments = this.store.query('comment', {
        limit: this.get('limit')
      });

      this.set('comments', comments);

    }
  }
});