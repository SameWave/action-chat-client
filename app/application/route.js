import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

const {
  Route,
  RSVP,
  isEmpty
} = Ember;

export default Route.extend(ApplicationRouteMixin, {

  beforeModel() {
    return this._loadSessionPerson();
  },

  model() {
    if (this.get('session.isAuthenticated')) {
      return this._findAll();
    }
  },

  setupController(controller, model) {
    controller.set('model', null);

    if (!isEmpty(model)) {
      this.setupSubscriptions(model);
    }
  },

  sessionAuthenticated() {
    this._loadSessionPerson().then(() => {
      this._findAll().then((model) => {
        this.setupSubscriptions(model);
        this.transitionTo('streams');
      });
    }).catch(() => this.get('session').send('logout'));
  },

  invalidationSucceeded() {
    this.transitionTo('login');
  },

  _loadSessionPerson() {
    return this.get('session').loadPerson();
  },

  _findAll() {
    return RSVP.hash({
      people: this.store.findAll('person'),
      streams: this.store.findAll('stream')
    });
  },

  setupSubscriptions(model) {

    this.store.initSubscriptions();

    this.store.subscribe({
      channel: 'StreamsChannel'
    });

    model.streams.forEach((stream) => {
      this.store.subscribe({
        channel: 'MembersChannel',
        stream_id: stream.get('id')
      });

      this.store.subscribe({
        channel: 'CommentsChannel',
        stream_id: stream.get('id')
      });
    });

  },

});