import DS from 'ember-data';
import Ember from 'ember';

const {
  run,
  isEmpty,
  computed,
  computed: {
    alias
  },
  observer,
  getOwner
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

  unreadCount: attr('number'),

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
  },

  personId: alias('person.id'),
  personName: alias('person.name'),

  // TODO: Improve this logic and ensure it isn't triggered too often
  unreadCountObserver: observer('unreadCount', function() {
    let sessionPersonId = getOwner(this).lookup('service:session').get('person.id');
    if (this.get('person.id') !== sessionPersonId) {
      return;
    }

    let count = this.get('person.members').mapBy('unreadCount').reduce((prev, next) => {
      prev = prev || 0;
      next = next || 0;
      return prev + next;
    }, 0);

    this.badge.setCount(count);
  })
});