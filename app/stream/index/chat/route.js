import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  Route,
  RSVP
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {

  model() {
    // TODO: Confirm that this comment lookup works for all scenarios
    let stream = this.modelFor('stream.index');
    return this.store.query('comment', {
      stream_id: stream.get('id')
    });
  },

  setupController(controller, model) {

    let stream = this.modelFor('stream.index');

    controller.setProperties({
      stream: stream,
      comments: model
    });
  }
});