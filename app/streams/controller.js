import Ember from 'ember';

const {
  Controller,
  inject,
  computed: {
    alias,
    sort
  }
} = Ember;

export default Controller.extend({
  session: inject.service(),
  streams: alias('model'),
  sortProperties: ['lastCommentedAt:desc'],
  sortedStreams: sort('streams', 'sortProperties'),

  actions: {
    gotoStreamChat(stream) {
      this.transitionToRoute('stream.index.chat', stream.get('id'));
    }
  }
});