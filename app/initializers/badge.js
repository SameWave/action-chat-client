import Ember from 'ember';

export default {
  name: 'badge',
  initialize(application) {
    let badge = Ember.Object.extend({

      isAvailable() {
        return window.cordova && window.cordova.plugins && window.cordova.plugins.notification.badge;
      },

      setCount(count) {
        if (this.isAvailable()) {
          // TODO: Make sure this isn't called too often...
          window.cordova.plugins.notification.badge.set(count);
        }
      },

    });

    application.register('service:badge', badge, {
      singleton: true
    });
    application.inject('model:member', 'badge', 'service:badge');
  }
};