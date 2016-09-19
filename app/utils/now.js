import Ember from 'ember';
import moment from 'moment';

const {
  testing
} = Ember;

// isFrozen = true; // Useful for developing entries related features or debugging tests
export default function now() {
  let isFrozen = testing;
  let timestamp = '2014-12-09T07:59:59+00:00';

  return isFrozen ? moment.utc(timestamp).clone() : moment.utc().clone();
}