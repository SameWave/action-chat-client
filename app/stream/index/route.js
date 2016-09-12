import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  model(params) {
    let stream = this.store.peekRecord('stream', params.stream_id);
    // This is for development and redirects - we should really only use peek
    if (stream === null) {
      stream = this.store.findRecord('stream', params.stream_id);
    }
    return stream;
  },

});