import DS from 'ember-data';

const {
	Model,
	attr,
	hasMany
} = DS;

export default Model.extend({
  name: attr('string'),

  members: hasMany('member', {
    inverse: 'person',
    async: true
  }),

  comments: hasMany('comment', {
    inverse: 'person',
    async: true
  })
});