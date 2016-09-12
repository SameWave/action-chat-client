import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    gotoLogin() {
      this.transitionToRoute('login');
    }
  }
});