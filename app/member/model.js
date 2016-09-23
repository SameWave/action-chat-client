import DS from 'ember-data';
import Ember from 'ember';

const {
  run,
  isEmpty,
  computed,
  observer
} = Ember;

const {
  Model,
  belongsTo,
  attr
} = DS;

export default Model.extend({

  person: belongsTo('person', {
    inverse: 'comments',
    async: true
  }),

  stream: belongsTo('stream', {
    inverse: 'comments',
    async: true
  }),

  lastReadAt: attr('date', {
    defaultValue() {
      return new Date();
    }
  }),

  typingAt: attr('date'),

  typingTimer: null,

  isTyping: false,

  typingAtObserver: observer('typingAt', function() {
    if (!isEmpty(this.get('typingAt'))) {
      this.set('isTyping', true);
      this.typingTimer = run.debounce(this, this.clearTypingAt, 1200);
    } else {
      this.set('isTyping', false);
    }
  }),

  clearTypingAt() {
    this.set('isTyping', false);
  }
});