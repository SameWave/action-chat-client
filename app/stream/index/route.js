import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  RSVP
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  model(params) {
    return RSVP.hash({
      stream: this.store.peekRecord('stream', params.stream_id),
      comments: this.store.query('comment', {
        page: {
          number: 1,
          size: 5
        },
        stream_id: params.stream_id,
      })
    });
  },

  afterModel(model) {
    model.stream.get('members')
  }

});