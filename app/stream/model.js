import Ember from 'ember';
import DS from 'ember-data';

const {
  computed,
  computed: {
    alias
  }
} = Ember;

const {
  Model,
  attr,
  hasMany,
  belongsTo
} = DS;

export default Model.extend({
  title: attr('string'),
  commentCount: attr('number'),

  members: hasMany('member', {
    inverse: 'stream',
    async: true
  }),

  comments: hasMany('comment', {
    inverse: 'stream',
    async: true
  })
});