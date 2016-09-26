import Ember from 'ember';
import ENV from 'action-chat-client/config/environment';

const {
  Service,
  $,
  RSVP
} = Ember;

const NETWORK_APNS = 'apns';
const NETWORK_GCM = 'gcm';

export default Service.extend({

  isAvailable: function() {
    return (ENV.environment !== 'test' && window.cordova && window.PushNotification);
  }.property(),

  setup(personId) {
    if (!this.get('isAvailable')) {
      if (ENV.environment === 'production') {
        alert('Push notification setup failed!');
      }
      return;
    }

    this.set('personId', personId);

    let push = window.PushNotification.init({
      'android': {
        'senderID': ENV.GCM_SENDER_ID
      },
      'ios': {
        'alert': 'true',
        'badge': 'true',
        'sound': 'true'
      },
      'windows': {}
    });

    push.on('registration', this.onRegistration.bind(this));
    push.on('notification', this.onNotification.bind(this));
    push.on('error', this.onError.bind(this));

  },

  onRegistration(data) {
    console.log('push onRegistration');
    // let platform = window.device.platform.toLowerCase();
    let platform = 'ios';
    let network = (platform === 'ios') ? NETWORK_APNS : (platform === 'android') ? NETWORK_GCM : false;

    if (!network) {
      return;
    }
    console.log('push: ' + data.registrationId);

    this.setProperties({
      network,
      token: data.registrationId
    });

    if (this.get('personId')) {
      this.createPushToken(this.get('personId'), this.get('token'), this.get('network')).then((response) => {
        Ember.debug('Push token created: ', response);
      });
    }
  },

  onNotification(data) {
    // data.message,
    // data.title,
    // data.count,
    // data.sound,
    // data.image,
    // data.additionalData

    Ember.debug('Push onNotification');

    // Don't redirect if the app is already in the foreground
    // if (ENV.state === 'ready') {
    //   return;
    // }
    // ENV.state = 'ready';

    // if (data.additionalData) {
    //   if (data.additionalData.url) {
    //     window.location.replace(window.location.pathname + data.additionalData.url.toString());
    //   }
    // }
  },

  onError(e) {
    Ember.debug('Push onError: ', e.message);
  },

  createPushToken(personId, token, network) {
    console.log('push createPushToken');
    let json = {
      person_id: personId,
      token,
      network
    };

    return new RSVP.Promise((resolve, reject) => {
      $.ajax({
        url: `${ENV.host}/push_tokens`,
        type: 'POST',
        data: {
          push_token: json
        }
      }).then((response) => {
        // TODO: Handle error response
        resolve(response);
      }, (error) => {
        let message = (error && error.hasOwnProperty('message')) ? error.message : 'Oh no! Something went wrong.';
        reject({
          message
        });
      });
    });
  }

});