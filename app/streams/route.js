import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  Route
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {

  model() {
    return this.store.peekAll('stream');
  },

  afterModel(model) {
    // Fetch the last comment for each stream
    model.forEach((stream) => {
      this.store.query('comment', {
        limit: 1,
        offset: 0,
        stream_id: stream.get('id')
      })
    });
  }
});