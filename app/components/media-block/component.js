import Ember from 'ember';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

const {
  Component
} = Ember;

export default Component.extend(RecognizerMixin, {
  classNames: ['c-media-block'],
  classNameBindings: ['isOpen'],
  recognizers: 'tap swipe pan',
  isOpen: false,

  title: '',
  date: '',
  body: '',

  swipeLeft() {
    this.set('isOpen', true);
  },

  swipeRight() {
    this.set('isOpen', false);
  },

  tap() {
    if (this.get('onTap')) {
      this.get('onTap')();
    }
  }
});