import DS from 'ember-data';

const {
  Model,
  attr,
  hasMany
} = DS;

export default Model.extend({
  title: attr('string'),

  members: hasMany('member', {
    inverse: 'stream',
    async: true
  }),

  comments: hasMany('comment', {
    inverse: 'stream',
    async: true
  })
});