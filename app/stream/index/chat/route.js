import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  Route,
  RSVP
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {

  model() {
    let stream = this.modelFor('stream.index').stream;
    return RSVP.hash({
      stream: stream,
      comments: this.store.peekAll('comment') //.filterBy('stream.id', stream.get('id'))
    });
  },

  setupController(controller, model) {
    let stream = model.stream;
    let comments = model.comments;

    controller.setProperties({
      comments: comments,
      stream: stream
    });
  }
});