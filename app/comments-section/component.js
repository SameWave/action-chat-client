import Ember from 'ember';

const {
  Component,
  computed: {
    sort
  },
  $
} = Ember;

export default Component.extend({
  classNames: ['c-comments-section'],
  sessionMember: null,
  comments: [],
  typers: [],
  sortProperties: ['createdAt', 'id'],
  sortedComments: sort('comments', 'sortProperties'),

  actions: {
    doTap() {
      $('#chat-area').blur();
    }
  }
});