import Ember from 'ember';

const {
  Component
} = Ember;

export default Component.extend({
  classNames: ['c-tool-bar'],

  actions: {
    doEdit() {
      if (this.get('isEditingDisabled')) {
        return;
      }
      if (this.get('onEdit')) {
        this.get('onEdit')();
      }
    }
  }
});