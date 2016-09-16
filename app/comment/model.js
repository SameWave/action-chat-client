import DS from 'ember-data';

const {
  Model,
  attr,
  belongsTo
} = DS;

export default Model.extend({
  body: attr('string'),

  createdAt: attr('date', {
    defaultValue() {
      return new Date();
    }
  }),

  person: belongsTo('person', {
    inverse: 'comments',
    async: true
  }),

  stream: belongsTo('stream', {
    inverse: 'comments',
    async: true
  })

});