import Ember from 'ember';

const {
  Component,
  computed,
  $
} = Ember;

export default Component.extend({
  classNames: ['c-comments-section'],
  comments: [],
  typers: [],
  sortProperties: ['createdAt', 'id'],
  sortedComments: computed.sort('comments', 'sortProperties'),

  newMessagesTop: 0,

  actions: {
    doTap() {
      $('#chat-area').blur();
    }
  }
});