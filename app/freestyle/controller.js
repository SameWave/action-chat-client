import Ember from 'ember';
import FreestyleController from 'ember-freestyle/controllers/freestyle';
import moment from 'moment';

const { inject, computed } = Ember;

export default FreestyleController.extend({
  emberFreestyle: inject.service(),

  date: computed(function() {
    return moment('1988-11-19');
  }),

  colorPalette: {
    'primary': {
      'name': 'cyan',
      'base': '#00bcd4'
    },
    'accent': {
      'name': 'amber',
      'base': '#ffc107'
    },
    'secondary': {
      'name': 'greyish',
      'base': '#b6b6b6'
    },
    'foreground': {
      'name': 'blackish',
      'base': '#212121'
    },
    'background': {
      'name': 'white',
      'base': '#ffffff'
    }
  }
});
