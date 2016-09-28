import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ENV from 'action-chat-client/config/environment';

const {
  Route,
  RSVP,
  debug,
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
  sessionPerson: alias('session.person'),

  model() {
    let {
      stream
    } = this.modelFor('stream.index');
    return RSVP.hash({
      stream,
      comments: this.store.peekAll('comment'),
      members: this.store.peekAll('member')
    });
  },

  setupController(controller, model) {
    let {
      stream,
      comments,
      members
    } = model;

    let streamMembers = members.filterBy('stream.id', stream.get('id'));
    let sessionMember = streamMembers.findBy('person.id', this.get('sessionPerson.id'));

    controller.setProperties({
      totalCommentCount: stream.get('commentCount'),
      previousLastReadAt: sessionMember.get('lastReadAt'),
      previousUnreadCount: sessionMember.get('unreadCount'),
      isObserving: true,
      comments,
      members,
      stream
    });
  },

  actions: {

    didTransition() {
      run.schedule('afterRender', this, () => {
        this.get('controller').didRender();
      });
    },

    willTransition() {
      this.set('controller.isObserving', false);
    }
  }
});