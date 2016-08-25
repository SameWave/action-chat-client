import Ember from 'ember';

export function dateFormat(params) {
  let date = params[0];
  return date.getHours() + ':' + date.getMinutes();
}

export default Ember.Helper.helper(dateFormat);