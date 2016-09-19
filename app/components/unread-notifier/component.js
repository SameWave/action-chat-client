import Ember from 'ember';

const {
  Component,
  computed,
  debug
} = Ember;

export default Component.extend({
  classNameBindings: [':c-unread-notifier'],
  lastReadAt: '',

  text: computed('lastReadAt', function() {
    if (this.get('lastReadAt')) {
      let date = this.get('lastReadAt');
      return `last read at: ${date.date()}/${date.month()}/${date.weekYear()}`;
    } else {
      return debug(`No date was set: ${this}`);
    }
  })
});
