import Ember from 'ember';

const {
  Controller,
  inject
} = Ember;

export default Controller.extend({
  session: inject.service(),

  actions: {

    doDevLogin() {
      this.setProperties({
        identification: 'graeme@samewave.com',
        password: 'password'
      });
      this.send('doLogin');
    },

    doLogin() {
      let credentials = this.getProperties('identification', 'password');
      let authenticator = 'authenticator:jwt';

      this.get('session').authenticate(authenticator, credentials).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      });
    }
  }
});