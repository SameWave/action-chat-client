import Ember from 'ember';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

const {
  Component
} = Ember;

export default Component.extend(RecognizerMixin, {
  classNames: ['c-media-block--stream'],
  recognizers: 'tap swipe',

  title: '',
  date: '',
  body: '',

  swipeLeft() {
    console.log('left');
    this.element.classList.add('is-open');
  },

  swipeRight() {
    console.log('right');
    this.element.classList.remove('is-open');
  },

  actions: {
    tapFront() {
      console.log('tapped Component');
      if (this.get('onTapFront')) {
        this.get('onTapFront')();
      }
    }
  }
});
