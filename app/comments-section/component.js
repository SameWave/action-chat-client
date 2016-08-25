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
  classNames: ['grey', 'lighten-4', 'section-body'],

  comments: [],
  typers: [],
  sortProperties: ['id'],
  sortedComments: sort('comments', 'sortProperties'),

  actions: {
    doTap() {
      $('#chat-area').blur();
    }
  }
});