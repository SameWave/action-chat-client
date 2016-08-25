import DS from 'ember-data';

const {
  run,
  isEmpty,
  computed
} = Ember;

export default DS.Model.extend({
  name: DS.attr('string'),

  comments: DS.hasMany('comment', {
    inverse: 'person',
    async: true
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