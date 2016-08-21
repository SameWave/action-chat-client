import Ember from 'ember';

// Default limit
const LIMIT = 10;

const {
  RSVP
} = Ember;

export default Ember.Route.extend({

  model() {
    return RSVP.hash({
      people: this.store.findAll('person'),
      comments: this.store.query('comment', {
        limit: LIMIT
      })
    });
  },

  setupController(controller, model) {

    let people = model.people;
    let comments = model.comments;

    controller.set('model', null);

    // TODO: Sort comments by createdAt instead of id
    controller.set('comments', comments);
    controller.set('limit', LIMIT);

    // TODO:
    // Show comment person
    // Show 'load earlier' if there are more unread comments
    // Show unread comments below new message line
    // Show who is typing
    //
  }
});