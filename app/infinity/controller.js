import Ember from 'ember';

export default Ember.Controller.extend({
  isReady: false,

  commentSortProperties: ['createdAt', 'id'],
  sortedComments: Ember.computed.sort('model', 'commentSortProperties'),

});