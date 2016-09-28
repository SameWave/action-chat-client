import Ember from 'ember';

const {
  Component
} = Ember;

export default Component.extend({
  classNames: ['c-comments-section'],
  sessionMember: null,
  comments: [],
  firstUnread: null,
  typers: [],
  selectedComment: null,

  actions: {
    doTap() {
      $('#chat-area').blur();
    }
  }
});