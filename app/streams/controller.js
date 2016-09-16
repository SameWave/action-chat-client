import Ember from 'ember';

const {
  computed: {
    alias,
    sort
  }
} = Ember;

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  streams: alias('model'),
  sortProperties: ['lastCommentedAt:desc'],
  sortedStreams: sort('streams', 'sortProperties'),

  actions: {
    gotoStreamChat(stream) {
      this.transitionToRoute('stream.index.chat', stream.get('id'));
    }
  }
});