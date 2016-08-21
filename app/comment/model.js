import DS from 'ember-data';

export default DS.Model.extend({
  body: DS.attr('string'),
  // person: DS.belongsTo('person'),
  // stream: DS.belongsTo('stream')
});