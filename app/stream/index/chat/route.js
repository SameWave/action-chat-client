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

    let sessionMember = members.findBy('person.id', this.get('sessionPerson.id'));

    controller.setProperties({
      totalCommentCount: stream.get('commentCount'),
      comments,
      members,
      stream,
      sessionMember
    });

    this.store.subscribe({
      channel: 'CommentsChannel',
      stream_id: stream.get('id')
    });

    this.store.subscribe({
      channel: 'MembersChannel',
      stream_id: stream.get('id')
    });
  },

  actions: {
    didTransition() {
      run.schedule('afterRender', this, function() {
        this.get('controller').didRender();
      });
    }
  }

});