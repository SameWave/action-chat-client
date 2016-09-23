import Ember from 'ember';

const {
  Component
} = Ember;

export default Component.extend({
  classNames: ['c-action-sheet'],

  actions: {
    selectItem(person) {
      if (this.get('onSelectItem')) {
        this.get('onSelectItem')(person);
      }
    }
  }
});
