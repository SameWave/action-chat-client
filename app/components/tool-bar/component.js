import Ember from 'ember';

const {
	Component
} = Ember;

export default Component.extend({
  classNames: ['c-tool-bar'],

  // Passed In
  isEditing: false,

  actions: {
    doEdit() {
      if (this.get('onEdit')) {
        this.get('onEdit')();
      }
    }
  }
});
