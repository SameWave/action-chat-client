import Ember from 'ember';

const {
  RSVP
} = Ember;

export default Ember.Route.extend({

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
      people: model.people
    });

    // TODO:
    // Deploy server to heroku
    // Show 'load earlier' if there are more unread comments
    // Show unread comments below new message line
    // Show who is typing
    // Authentication
    // Authorization per stream
    //
  }
});