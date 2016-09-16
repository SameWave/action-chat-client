import DS from 'ember-data';
import Ember from 'ember';
import ENV from 'action-chat-client/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const {
	JSONAPIAdapter
} = DS;

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  host: ENV.host,
  authorizer: 'authorizer:custom',

  pathForType(type) {
    return Ember.String.pluralize(Ember.String.underscore(type));
  }

});