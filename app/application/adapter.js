import DS from 'ember-data';
import Ember from 'ember';
import ENV from 'action-chat-client/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const {
  JSONAPIAdapter
} = DS;

const {
  String,
  inject: {
    service
  },
  isEmpty,
  RSVP,
  debug
} = Ember;

const channels = {
  stream: 'StreamsChannel',
  comment: 'CommentsChannel',
  member: 'MembersChannel'
};

export default JSONAPIAdapter.extend(DataAdapterMixin, {

  cable: service(),

  host: ENV.host,
  authorizer: 'authorizer:custom',
  _consumer: null,
  _subscriptions: {},

  // Overridden functions

  pathForType(type) {
    return String.pluralize(String.underscore(type));
  },

  generateIdForRecord() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16 | 0;
      let v = (c === 'x') ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  createRecord(store, type, snapshot) {
    // debug('createRecord');
    return this._send('create', snapshot);
  },

  updateRecord(store, type, snapshot) {
    // debug('updateRecord');
    return this._send('update', snapshot);
  },

  deleteRecord(store, type, snapshot) {
    // debug('deleteRecord');
    return this._send('destroy', snapshot);
  },

  // Custom functions

  initSubscriptions() {
    if (isEmpty(this._consumer)) {
      this._consumer = this.get('cable').createConsumer(ENV.socket);
      this.subscribe({
        channel: 'StreamsChannel'
      });
    }
  },

  _send(action, snapshot) {
    let serialized = this.serialize(snapshot, {
      includeId: true
    });
    return new RSVP.Promise((resolve) => {
      // TODO: Is it ok to assume success here?
      this._subscriptionForModel(snapshot.modelName).send({
        action: action,
        data: serialized.data
      });
      resolve();
    });
  },

  _subscriptionForModel(modelName) {
    return this._subscriptions[channels[modelName]];
  },

  subscribe(options) {
    let {
      channel
    } = options;

    this._subscriptions[channel] = this._consumer.subscriptions.create(options, {

      connected() {
        // debug(`connected to ${channel}`);
      },

      disconnected() {
        // debug(`disconnected from ${channel}`);
      },

      received: (message) => {
        // debug(`received in ${channel}`);

        if (['created', 'updated'].includes(message.action)) {
          this.store.pushPayload(message.data);
        } else if (message.action === 'destroyed') {
          // Record was destroyed by another client so we need to unload it from the store
          let record = this.store.peekRecord(message.modelName, message.data.data.id);
          if (record) {
            record.unloadRecord();
          }
        }
      }
    });
  }
});