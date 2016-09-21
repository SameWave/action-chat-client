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

  initSubscriptions() {
    if (isEmpty(this._consumer)) {
      this._consumer = this.get('cable').createConsumer(ENV.socket);
      this.subscribe('stream');
    }
  },

  generateIdForRecord() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16 | 0;
      let v = (c === 'x') ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  createRecord(type, snapshot) {
    let data = this.serialize(snapshot, {
      includeId: true
    });

    let subscription = this._subscriptions[channels[type]];

    return new RSVP.Promise((resolve) => {
      // TODO: Is it ok to assume success here?
      subscription.send({
        action: 'create',
        stream: data.data
      });
      resolve();
    });

  },

  updateRecord(type, snapshot) {
    debug('adapter updateRecord');

    let data = this.serialize(snapshot, {
      includeId: true
    });

    let subscription = this._subscriptions[channels[type]];

    return new RSVP.Promise((resolve) => {
      // TODO: Is it ok to assume success here?
      subscription.send({
        action: 'update',
        stream: data.data
      });
      resolve();
    });
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
        // TODO: Remove data.data nesting here
        let snapshot = message.data.data;

        if (message.action === 'created') {
          this._createdRecord(modelName, snapshot);
        } else {
          this._updatedRecord(modelName, snapshot);
        }
      }
    });
  },

  _createdRecord(modelName, snapshot) {

    let record = this.store.peekRecord(modelName, snapshot.id);

    // Record was created by another client so we need to push into the store
    if (isEmpty(record)) {
      this.store.pushPayload(snapshot);
    }
  },

  _updatedRecord(modelName, snapshot) {

    let record = this.store.peekRecord(modelName, snapshot.id);
    // let modelClass = this.store.modelFor(modelName);
    // let serializer = this.store.serializerFor(modelName);
    // let normalized = serializer.normalizeSingleResponse(this.store, modelClass, snapshot, snapshot.id);

    // TODO: Do we need to set relationships here?
    record.setProperties(snapshot.attributes);

    // TODO: Is there a cleaner way to do this?
    record._internalModel.flushChangedAttributes();
    record._internalModel.adapterWillCommit();
    record._internalModel.adapterDidCommit();
  }
});