import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({
  setupController(controller) {
    controller.setProperties({
      isEditing: false,
      isEditingDisabled: false
    });
  }
});