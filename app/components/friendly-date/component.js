import Ember from 'ember';
import moment from 'moment';

const {
	Component,
	computed
} = Ember;

export default Component.extend({
  date: null,
  showTime: false,
  isLocal: false,

  label: computed('date', 'showTime', function() {
    if (!this.get('date')) {
      return;
    }

    let label;

    let today = moment.utc().startOf('day');

    let date = (moment.isMoment(this.get('date'))) ? this.get('date') : this.get('isLocal') ? moment(this.get('date')) : moment.utc(this.get('date'));

    if (date >= today) {
      label = date.format('HH:mm');
    } else {
      let dateOn = moment(date).clone().startOf('day');
      let daysSinceDate = Math.abs(dateOn.diff(today, 'days'));

      if (daysSinceDate < 2) {
        label = 'Yesterday';
      } else if (daysSinceDate < 7) {
        label = dateOn.format('dddd');
      } else if (this.get('showTime')) {
        label = dateOn.format('DD/MM/YYYY | HH:MM');
      } else {
        label = dateOn.format('DD/MM/YYYY');
      }
    }

    return label;
  })
});