import Ember from 'ember';

const {
  Component
} = Ember;

export default Component.extend({
  classNames: ['c-mention-list'],

  actions: {
    selectItem(item) {
      if (this.get('onSelectItem')) {
        this.get('onSelectItem')(item);
      }
    }
  }
});
