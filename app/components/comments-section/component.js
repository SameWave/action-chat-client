import Ember from 'ember';

const {
  Component,
  isEmpty
} = Ember;

export default Component.extend({
  classNames: ['c-comments-section'],
  sessionMember: null,
  comments: [],
  firstUnread: null,
  selectedComment: null,

  actions: {
    doTap() {
      if (isEmpty(selectedComment)) {
        $('#chat-area').blur();
      }
    }
  }
});