import Ember from 'ember';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  classNameBindings: [':c-unread-notifier', 'isHidden'],
  lastReadAt: '',

  isHidden: false,

  text: computed('lastReadAt', function() {
    let date = this.get('lastReadAt');
    let output = `last read at: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    return output;
  }),

  click() {
    this.set('isHidden', true);
  }
});
