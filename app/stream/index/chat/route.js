import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ENV from 'action-chat-client/config/environment';

const {
  Route,
  RSVP,
  inject: {
    service
  },
  run,
  computed: {
    alias
  }
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {

  session: service(),
  cable: service(),
  user: alias('session.person'),

  model() {
    let stream = this.modelFor('stream.index').stream;
    return RSVP.hash({
      stream: stream,
      comments: this.store.peekAll('comment'),
      members: this.store.peekAll('member').filterBy('stream.id', stream.get('id'))
    });
  },

  setupController(controller, model) {
    let stream = model.stream;
    let comments = model.comments;
    let members = model.members;

    let sessionMember = members.findBy('person.id', this.get('user.id'));

    controller.setProperties({
      totalCommentCount: stream.get('commentCount'),
      comments: comments,
      stream: stream,
      members: members,
      sessionMember: sessionMember
    });

    const consumer = this.get('cable').createConsumer(ENV.socket);

    this.subscribeComments(consumer, controller, model);
    this.subscribeMembers(consumer, controller, model);
  },

  subscribeComments(consumer, controller, model) {
    let stream = model.stream;
    let channel = 'CommentsChannel';

    Ember.debug('subscribeComments');

    const subscription = consumer.subscriptions.create({
      channel: channel,
      stream_id: stream.get('id')
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

  subscribeMembers(consumer, controller, model) {
    let stream = model.stream;
    let channel = 'MembersChannel';

    const subscription = consumer.subscriptions.create({
      channel: channel,
      stream_id: stream.get('id')
    }, {

      connected() {
        Ember.debug(`connected to ${channel}`);
        controller.setLastReadAt();
      },

      disconnected() {
        Ember.debug(`disconnected from ${channel}`);
      },

      received: (data) => {
        controller.receivedMembersData(data);
      }
    });

    controller.set('membersSubscription', subscription);
  },

  actions: {
    didTransition() {
      Ember.debug('didTransition');

      run.schedule('afterRender', this, function() {
        this.get('controller').didRender();
      });
    }
  }

});