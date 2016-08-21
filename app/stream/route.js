import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('comment');
  },

  setupController(controller, model) {
    let comments = model;

    controller.set('model', null);
    controller.set('comments', comments);
  }
});