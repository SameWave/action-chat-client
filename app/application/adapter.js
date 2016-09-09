import DS from 'ember-data';
import Ember from 'ember';
import ENV from 'action-chat-client/config/environment';

export default DS.JSONAPIAdapter.extend({
  host: ENV.host,
  pathForType: function(type) {
    return Ember.String.pluralize(Ember.String.underscore(type));
  }
});