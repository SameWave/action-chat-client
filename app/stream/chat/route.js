import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  Route,
  RSVP
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return RSVP.hash({
      people: this.store.findAll('person'),
      comments: this.store.findAll('comment') // Limits to 10 on server
    });
  },

  setupController(controller, model) {
    controller.setProperties({
      model: null,
      comments: model.comments,
      people: model.people,
      user: model.people.findBy('id', '1') // TODO: This shouldn't be hardcoded
    });

    // TODO:
    // Show 'load earlier' if there are more unread comments
    // Show unread comments below new message line
    // Show who is typing

    // Authentication
    // Authorization per stream
  }
});