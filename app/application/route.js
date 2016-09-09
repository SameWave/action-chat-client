import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {

  beforeModel() {
    return this._loadSessionPerson();
  },

  sessionAuthenticated() {
    this._loadSessionPerson().then(() => {
      this.transitionTo('stream');
    }).catch(() => this.get('session').send('logout'));
  },

  _loadSessionPerson() {
    return this.get('session').loadPerson();
  }
});