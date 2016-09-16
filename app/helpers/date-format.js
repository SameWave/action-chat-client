import Ember from 'ember';

const {
	Helper
} = Ember;

export function dateFormat(params) {
  let [date] = params;
  return date.toTimeString();
}

export default Helper.helper(dateFormat);