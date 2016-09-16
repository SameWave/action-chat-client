import Ember from 'ember';
import SessionService from 'ember-simple-auth/services/session';

const {
  computed: {
    alias
  },
  inject: {
    service
  },
  RSVP,
  isEmpty
} = Ember;

export default SessionService.extend({

  store: service(),
  push: service(),
  person: null,

  token: alias('data.authenticated.token'),

  loadPerson() {
    return new RSVP.Promise((resolve, reject) => {
      if (!isEmpty(this.get('token'))) {
        // TODO: Use the person ID here rather than 'me'
        return this.get('store').findRecord('person', 'me').then((person) => {
          this.set('person', person);
          this.get('push').setup(person.get('id'));
          resolve();
        }, reject);
      } else {
        resolve();
      }
    });
  },

  actions: {
    logout() {
      this.invalidate();
      // TODO: unset this.person
    }
  }

});