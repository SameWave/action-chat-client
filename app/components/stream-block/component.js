import Ember from 'ember';
import SwipableListItemMixin from 'action-chat-client/mixins/swipable-list-item';

const {
  Component,
  computed,
  inject: {
    service
  }
} = Ember;

export default Component.extend(SwipableListItemMixin, {
  classNames: ['c-media-block--stream'],

  session: service(),

  stream: null,

  memberNames: computed('stream.members.@each.personName', function() {
    return this.get('stream.members').mapBy('person.name').compact().join(', ');
  }),

  unreadCount: computed('session.person.id', 'stream.members.@each.personId', function() {
    let sessionMember = this.get('stream.members').findBy('personId', this.get('session.person.id'));
    return sessionMember.get('unreadCount') || 0;
  })
});