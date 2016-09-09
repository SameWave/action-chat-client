import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  actions: {
    doLogin() {
      let credentials = this.getProperties('identification', 'password'),
        authenticator = 'authenticator:jwt';

      this.get('session').authenticate(authenticator, credentials).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      });
    }
  }
});