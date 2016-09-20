import Ember from 'ember';
import DS from 'ember-data';
import ENV from 'action-chat-client/config/environment';

const {
  Store
} = DS;

const {
  isArray
} = Ember;

export default Store.extend({

  init() {
    this._super(...arguments);

    // TODO: Is there a better place to trigger this?
    this.subscribe();
  },

  subscribe() {
    Ember.debug(`store subscribe`);
    let adapter = this.adapterFor('application');
    adapter.initSubscriptions();
  }

});