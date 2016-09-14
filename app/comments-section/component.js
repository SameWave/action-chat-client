import Ember from 'ember';

const {
  computed: {
    sort
  },
  $
} = Ember;

export default Ember.Component.extend({

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