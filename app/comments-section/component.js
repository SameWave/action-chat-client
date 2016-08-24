import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'section',

  elementId: 'comments',
  classNames: ['grey', 'lighten-4', 'section-body'],

  actions: {
    doTap() {
      $('#chat-area').blur();
    }
  }
});