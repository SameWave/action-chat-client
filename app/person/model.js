import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),

  members: DS.hasMany('member', {
    inverse: 'person',
    async: true
  }),

  comments: DS.hasMany('comment', {
    inverse: 'person',
    async: true
  })
});