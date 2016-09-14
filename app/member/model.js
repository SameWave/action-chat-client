import DS from 'ember-data';

const {
  run,
  isEmpty,
  computed
} = Ember;

const {
  Model,
  belongsTo
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

  lastReadAt: DS.attr('date', {
    defaultValue: function() {
      return new Date();
    }
  }),

  typingAt: null,
  typingTimer: null,

  isTyping: computed('typingAt', function() {
    return !isEmpty(this.get('typingAt'));
  }),

  setTypingAt(typingAt) {
    this.set('typingAt', typingAt);
    this.typingTimer = run.debounce(this, this.clearTypingAt, 1200);
  },

  clearTypingAt() {
    this.set('typingAt', null);
  }

});