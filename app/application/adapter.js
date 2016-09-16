import DS from 'ember-data';
import Ember from 'ember';
import ENV from 'action-chat-client/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const {
	JSONAPIAdapter
} = DS;

const {
	String
} = Ember;

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  host: ENV.host,
  authorizer: 'authorizer:custom',

  pathForType(type) {
    return String.pluralize(String.underscore(type));
  }
});