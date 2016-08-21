import Ember from 'ember';

// Default limit
const LIMIT = 10;

export default Ember.Route.extend({
  model() {
    return this.store.query('comment', {
      limit: LIMIT
    });
  },

  setupController(controller, model) {
    let comments = model;

    controller.set('model', null);

    // TODO: Sort comments by createdAt instead of id
    controller.set('comments', comments);
    controller.set('limit', LIMIT);

    // TODO:
    // Show 'load earlier' if there are more unread comments
    // Show unread comments below new message line
    // Show who is typing
    //
  }
});