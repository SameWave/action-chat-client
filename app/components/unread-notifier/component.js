import Ember from 'ember';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  classNameBindings: [':c-chat-notifier'],
  lastReadAt: '',

  text: computed('lastReadAt', function() {
    let date = this.get('lastReadAt');
    return `last read at: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  })
});
