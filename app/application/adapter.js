import DS from 'ember-data';
import Ember from 'ember';

export default DS.JSONAPIAdapter.extend({
  pathForType: function(type) {
    return Ember.String.pluralize(Ember.String.underscore(type));
  }
});