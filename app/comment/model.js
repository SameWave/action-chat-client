import DS from 'ember-data';

export default DS.Model.extend({
  body: DS.attr('string'),

  person: DS.belongsTo('person', {
    inverse: 'comments',
    async: true
  }),

  stream: DS.belongsTo('stream', {
    inverse: 'comments',
    async: true
  }),
});