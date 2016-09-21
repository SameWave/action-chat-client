import DS from 'ember-data';
import Ember from 'ember';
import ENV from 'action-chat-client/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const {
  JSONAPIAdapter
} = DS;

const {
  // String,
  inject: {
    service
  },
  isEmpty,
  RSVP,
  debug
} = Ember;

const channels = {
  stream: 'StreamsChannel'
};

export default JSONAPIAdapter.extend(DataAdapterMixin, {

  cable: service(),

  host: ENV.host,
  authorizer: 'authorizer:custom',
  _consumer: null,
  _subscriptions: {},

  // pathForType(type) {
  //   return String.pluralize(String.underscore(type));
  // },

  generateIdForRecord() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16 | 0;
      let v = (c === 'x') ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  createRecord(store, type, snapshot) {
    let data = this.serialize(snapshot, {
      includeId: true
    });

    return new RSVP.Promise((resolve) => {
      // TODO: Is it ok to assume success here?
      this._subscriptionForModel(snapshot.modelName).send({
        action: 'create',
        stream: data.data
      });
      resolve();
    });

  },

  updateRecord(store, type, snapshot) {
    debug('adapter updateRecord');

    let data = this.serialize(snapshot, {
      includeId: true
    });

    return new RSVP.Promise((resolve) => {
      // TODO: Is it ok to assume success here?
      this._subscriptionForModel(snapshot.modelName).send({
        action: 'update',
        stream: data.data
      });
      resolve();
    });
  },

  deleteRecord(store, type, snapshot) {
    debug('deleteRecord');

    let data = this.serialize(snapshot, {
      includeId: true
    });

    return new RSVP.Promise((resolve) => {
      // TODO: Is it ok to assume success here?
      this._subscriptionForModel(snapshot.modelName).send({
        action: 'destroy',
        stream: data.data
      });
      resolve();
    });
  },

  initSubscriptions() {
    if (isEmpty(this._consumer)) {
      this._consumer = this.get('cable').createConsumer(ENV.socket);
      this.subscribe('stream');
    }
  },

  _subscriptionForModel(modelName) {
    return this._subscriptions[channels[modelName]];
  },

  subscribe(modelName) {
    let channel = channels[modelName];

    this._subscriptions[channel] = this._consumer.subscriptions.create({
      channel
    }, {

      connected() {
        debug(`connected to ${channel}`);
      },

      disconnected() {
        debug(`disconnected from ${channel}`);
      },

      received: (message) => {
        debug(`received in ${channel}`);

        if (message.action === 'created') {
          this._createdRecord(modelName, message.data);
        } else if (message.action === 'updated') {
          this._updatedRecord(modelName, message.data);
        } else if (message.action === 'destroyed') {
          this._destroyedRecord(modelName, message.data);
        }
      }
    });
  },

  _createdRecord(modelName, data) {
    debug('record created');
    let snapshot = data;
    let record = this.store.peekRecord(modelName, snapshot.id);

    // Record was created by another client so we need to push into the store
    if (isEmpty(record)) {
      this.store.pushPayload(snapshot);
    }
  },

  _updatedRecord(modelName, data) {
    debug('record updated');
    let snapshot = data.data;
    let record = this.store.peekRecord(modelName, snapshot.id);

    if (!isEmpty(record)) {
      // TODO: Do we need to set relationships here?
      record.setProperties(snapshot.attributes);

      // TODO: Is there a cleaner way to do this?
      record._internalModel.flushChangedAttributes();
      record._internalModel.adapterWillCommit();
      record._internalModel.adapterDidCommit();
    }
  },

  _destroyedRecord(modelName, data) {
    debug('record destroyed');
    let snapshot = data.data;
    let record = this.store.peekRecord(modelName, snapshot.id);
    // Record was destroyed by another client so we need to remove it from the store
    if (!isEmpty(record)) {
      record.unloadRecord();
    }
  }
});