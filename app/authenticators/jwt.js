import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';
import ENV from '../config/environment';

const {
  isEmpty,
  RSVP: {
    Promise
  },
  $: {
    ajax
  },
  run
} = Ember;

export default Base.extend({

  tokenEndpoint: `${ENV.host}/person_token`,

  restore(data) {
    return new Promise((resolve, reject) => {
      if (!isEmpty(data.token)) {
        resolve(data);
      } else {
        reject();
      }
    });
  },

  authenticate(creds) {
    let {
      identification,
      password
    } = creds;

    let data = JSON.stringify({
      auth: {
        email: identification,
        password
      }
    });

    let requestOptions = {
      url: this.tokenEndpoint,
      type: 'POST',
      data,
      contentType: 'application/json',
      dataType: 'json'
    };

    return new Promise((resolve, reject) => {
      ajax(requestOptions).then((response) => {
        let {
          jwt
        } = response;
        // Wrapping aync operation in Ember.run
        run(() => {
          resolve({
            token: jwt
          });
        });
      }, (error) => {
        // Wrapping aync operation in Ember.run
        run(() => {
          reject(error);
        });
      });
    });
  },

  invalidate(data) {
    return Promise.resolve(data);
  }
});