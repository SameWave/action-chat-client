import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ENV from 'action-chat-client/config/environment';

const {
  Route,
  RSVP,
  inject: {
    service
  }
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {

  cable: service(),

  model() {
    let stream = this.modelFor('stream.index').stream;
    return RSVP.hash({
      stream: stream,
      comments: this.store.peekAll('comment')
    });
  },

  setupController(controller, model) {
    let stream = model.stream;
    let comments = model.comments;

    controller.setProperties({
      allComments: comments,
      stream: stream
    });

    this.subscribeComments(controller, model);
    this.subscribeMembers(controller, model);
  },

  subscribeComments(controller, model) {
    let stream = model.stream;
    let channel = 'CommentsChannel';

    Ember.debug('subscribeComments');

    const consumer = this.get('cable').createConsumer(ENV.socket);
    const subscription = consumer.subscriptions.create({
      channel: channel,
      // stream_id: stream.get('id')
    }, {
      connected() {
        Ember.debug(`connected to ${channel}`);
      },

      disconnected() {
        Ember.debug(`disconnected from ${channel}`);
      },

      received(data) {
        Ember.debug(`${channel} received data -> ${Ember.inspect(data)}`);
        controller.receivedCommentsData(data);
      }
    });

    controller.set('commentsSubscription', subscription);
  },

  subscribeMembers(controller) {
    let consumer = this.get('cable').createConsumer(ENV.socket);
    let channel = 'StreamsChannel';

    let subscription = consumer.subscriptions.create(channel, {

      connected() {
        Ember.debug(`connected to ${channel}`);
      },

      disconnected() {
        Ember.debug(`disconnected from ${channel}`);
      },

      received: (data) => {
        controller.receivedMembersData(data);
      }
    });

    controller.set('membersSubscription', subscription);
  }

});