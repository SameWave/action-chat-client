import Ember from 'ember';

const {
  computed: {
    alias
  }
} = Ember;

export default Ember.Controller.extend({
  streams: alias('model'),

  actions: {
    gotoStreamChat(stream) {
      this.transitionToRoute('stream.index.chat', stream.get('id'));
    }
  }
});