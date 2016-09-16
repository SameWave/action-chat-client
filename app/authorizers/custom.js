import Base from 'ember-simple-auth/authorizers/base';
import Ember from 'ember';

const {
	inject
} = Ember;

export default Base.extend({
  session: inject.service(),

  authorize(data, block) {
    let {
      token
    } = data;

    if (this.get('session.isAuthenticated') && token) {
      block('Authorization', `Bearer ${token}`);
    }
  }
});