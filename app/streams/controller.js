import Ember from 'ember';

const {
  Controller,
  inject,
  computed: {
    alias
  }
} = Ember;

export default Controller.extend({
  session: inject.service(),
  streams: alias('model'),

  actions: {
    gotoStreamChat(stream) {
      this.transitionToRoute('stream.index.chat', stream.get('id'));
    }
  }
});