import DS from 'ember-data';
import Ember from 'ember';

const {
  Model,
  hasMany,
  attr
} = DS;

export default Model.extend({
  name: attr('string'),
  isAdmin: attr('boolean'),

  members: hasMany('member', {
    inverse: 'person',
    async: true
  }),

  comments: hasMany('comment', {
    inverse: 'person',
    async: true
  })

});