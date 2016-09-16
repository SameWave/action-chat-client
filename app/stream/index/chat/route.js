import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ENV from 'action-chat-client/config/environment';

const {
  Route,
  debug,
  RSVP,
  inspect,
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
    let { stream } = this.modelFor('stream.index');
    return RSVP.hash({
      stream,
      comments: this.store.peekAll('comment'),
      members: this.store.peekAll('member').filterBy('stream.id', stream.get('id'))
    });
  },

  setupController(controller, model) {
    let { stream } = model;
    let { comments } = model;
    let { members } = model;

    let sessionMember = members.findBy('person.id', this.get('user.id'));

    controller.setProperties({
      allComments: comments,
      stream,
      members,
      sessionMember
    });

    let consumer = this.get('cable').createConsumer(ENV.socket);

    this.subscribeComments(consumer, controller, model);
    this.subscribeMembers(consumer, controller, model);
  },

  subscribeComments(consumer, controller, model) {
    let { stream } = model;
    let channel = 'CommentsChannel';

    debug('subscribeComments');

    let subscription = consumer.subscriptions.create({
      channel,
      stream_id: stream.get('id')
    }, {
      connected() {
        debug(`connected to ${channel}`);
      },

      disconnected() {
        debug(`disconnected from ${channel}`);
      },

      received(data) {
        debug(`${channel} received data -> ${inspect(data)}`);
        controller.receivedCommentsData(data);
      }
    });

    controller.set('commentsSubscription', subscription);
  },

  subscribeMembers(consumer, controller, model) {
    let { stream } = model;
    let channel = 'MembersChannel';

    let subscription = consumer.subscriptions.create({
      channel,
      stream_id: stream.get('id')
    }, {

      connected() {
        debug(`connected to ${channel}`);
        controller.setLastReadAt();
      },

      disconnected() {
        debug(`disconnected from ${channel}`);
      },

      received: (data) => {
        controller.receivedMembersData(data);
      }
    });

    controller.set('membersSubscription', subscription);
  },

  actions: {
    didTransition() {
      debug('didTransition');

      run.schedule('afterRender', this, function() {
        this.get('controller').didRender();
      });
    }
  }

});