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
  isEmpty
} = Ember;

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
      this.subscribe('StreamsChannel', 'stream');
    }
  },

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

    // TODO: Infer this channel name
    let subscription = this._subscriptions['StreamsChannel'];

    return new Ember.RSVP.Promise((resolve, reject) => {
      subscription.send({
        action: 'create',
        stream: data.data
      });
      resolve();
    });

  },

  updateRecord(store, type, snapshot) {
    Ember.debug(`adapter updateRecord`);

    let data = this.serialize(snapshot, {
      includeId: true
    });

    // TODO: Infer this channel name
    let subscription = this._subscriptions['StreamsChannel'];

    return new Ember.RSVP.Promise((resolve, reject) => {
      subscription.send({
        action: 'update',
        stream: data.data
      });
      resolve();
    });
  },

  subscribe(channel, modelName) {
    let store = this.store;

    this._subscriptions[channel] = this._consumer.subscriptions.create({
      channel
    }, {

      connected() {
        Ember.debug(`connected to ${channel}`);
      },

      disconnected() {
        Ember.debug(`disconnected from ${channel}`);
      },

      received: (message) => {
        Ember.debug(`received in ${channel}`);
        if (message.action === 'created') {
          this._createdRecord(store, modelName, message.data);
        } else {
          this._updatedRecord(store, modelName, message.data);
        }
      }
    });
  },

  _createdRecord(store, type, snapshot) {

    let record = this.store.peekRecord(modelName, snapshot.id);

    // Record was created by another client so we need to push into the store
    if (isEmpty(record)) {
      store.pushPayload(snapshot);
    }
  },

  _updatedRecord(store, type, snapshot) {

    let record = this.store.peekRecord(modelName, snapshot.id);

    var modelClass = store.modelFor(modelName);
    var serializer = store.serializerFor(modelName);
    var normalized = serializer.normalizeSingleResponse(store, modelClass, snapshot, snapshot.id);

    // TODO: Set the relevant record properties, not just title
    record.set('title', normalized.title);

    // TODO: Is there a cleaner way to do this?
    record._internalModel.flushChangedAttributes();
    record._internalModel.adapterWillCommit();
    record._internalModel.adapterDidCommit();
  }
});