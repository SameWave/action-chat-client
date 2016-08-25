import DS from 'ember-data';

export default DS.Model.extend({
  body: DS.attr('string'),

  createdAt: DS.attr('date', {
    defaultValue: function() {
      return new Date();
    }
  }),

  person: DS.belongsTo('person', {
    inverse: 'comments',
    async: true
  }),

  stream: DS.belongsTo('stream', {
    inverse: 'comments',
    async: true
  }),


});