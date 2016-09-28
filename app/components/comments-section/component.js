import Ember from 'ember';

const {
  Component
} = Ember;

export default Component.extend({
  classNames: ['c-comments-section'],
  sessionMember: null,
  comments: [],
  selectedComment: null,
  firstUnread: null,

  actions: {
    doTap() {
      $('#chat-area').blur();
    }
  }
});