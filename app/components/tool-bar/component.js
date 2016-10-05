import Ember from 'ember';

const {
	Component
} = Ember;

export default Component.extend({
  actions: {
    doEdit() {
      if (this.get('onEdit')) {
        this.get('onEdit')();
      }
    }
  }
});
