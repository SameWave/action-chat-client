import Ember from 'ember';
import moment from 'moment';
import now from 'action-chat-client/utils/now';

const {
	Component
} = Ember;

export default Component.extend({
  tagName: 'span',
  classNames: ['friendly-date'],

  date: null,
  showTime: false,
  isLocal: false,

  label: function() {

    if (!this.get('date')) {
      return;
    }

    let label;

    let today = now().startOf('day');

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
  }.property('date', 'showTime')
});