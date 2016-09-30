import Ember from 'ember';

const {
  Controller,
  inject
} = Ember;

export default Controller.extend({
  session: inject.service(),

  actions: {

    doGraemeLogin() {
      this.setProperties({
        identification: 'graeme@samewave.com',
        password: 'password'
      });
      this.send('doLogin');
    },

    doMondeLogin() {
      this.setProperties({
        identification: 'monde@samewave.com',
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