import Ember from 'ember';

const {
  Controller,
  inject: {
    service
  },
  computed: {
    alias
  }
} = Ember;

export default Controller.extend({
  session: service(),

  stream: alias('model.stream'),

  actions: {
    gotoStreams() {
      this.transitionToRoute('streams');
    }
  }
});