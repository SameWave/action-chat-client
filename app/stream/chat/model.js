import DS from 'ember-data';

const {
	Model,
	attr,
	hasMany
} = DS

export default Model.extend({
	title: attr('string'),

	comments: hasMany('comment', {
		inverse: 'stream',
		async: true
	}),
});