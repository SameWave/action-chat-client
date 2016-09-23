import Ember from 'ember';
import SessionService from 'ember-simple-auth/services/session';

const {
  isEmpty,
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
        let personId = JSON.parse(atob(this.get('data.authenticated.token').split('.')[1])).sub;
        return this.get('store').findRecord('person', personId).then((person) => {
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