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

  typingAt: attr('date', {
    defaultValue() {
      return new Date();
    }
  }),

  typingTimer: null,

  isTyping: computed('typingAt', function() {
    return !isEmpty(this.get('typingAt'));
  }),

  typingAtObserver: observer('typingAt', function() {
    if (!isEmpty(this.get('typingAt'))) {
      this.typingTimer = run.debounce(this, this.clearTypingAt, 1200);
    }
  }),

  clearTypingAt() {
    this.set('typingAt', null);
  }

});