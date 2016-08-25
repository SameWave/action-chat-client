import Ember from 'ember';

const {
  computed,
  computed: {
    sort
  }
} = Ember;

export default Ember.Component.extend({

  tagName: 'section',

  elementId: 'comments',

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