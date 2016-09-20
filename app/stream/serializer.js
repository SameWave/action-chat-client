import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({

  serialize(snapshot, options) {
    var json = this._super(...arguments);

    delete json.data.attributes['comment-count'];
    delete json.data.relationships;
    return json;
  }
});