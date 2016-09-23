import Ember from 'ember';

const {
  Controller,
  inject: {
    service
  },
  computed,
  computed: {
    alias
  }
} = Ember;

export default Controller.extend({
  session: service(),

  stream: alias('model.stream'),
  members: alias('model.members'),

  typers: computed('session.person.id', 'members.@each.isTyping', function() {
    return this.get('members').rejectBy('person.id', this.get('session.person.id')).filterBy('isTyping');
  }),

  typingNotice: computed('typers.[]', function() {
    let names = this.get('typers').mapBy('person.name');
    switch (names.get('length')) {
      case 0:
        return '';
      case 1:
        return `${names.objectAt(0)} is typing ...`;
      case 2:
        return `${names.objectAt(0)} and ${names.objectAt(1)} are typing...`;
      case 3:
        return `${names.objectAt(0)}, ${names.objectAt(1)} and 1 other are typing...`;
      default:
        return `${names.objectAt(0)}, ${names.objectAt(1)} and ${(names.get('length') - 2)} others are typing...`;
    }
  }),

  memberNames: computed('members.[]', function() {
    return this.get('members').mapBy('person.name').compact().join(', ');
  }),

  headerContent: computed('typingNotice', 'memberNames', function() {
    return this.get('typingNotice') || this.get('memberNames');
  }),

  actions: {
    gotoStreams() {
      this.transitionToRoute('streams');
    }
  }
});