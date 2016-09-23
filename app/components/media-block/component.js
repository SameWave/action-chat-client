import Ember from 'ember';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

const {
  Component
} = Ember;

export default Component.extend(RecognizerMixin, {
  classNames: ['c-media-block--stream'],

  recognizers: 'swipe',

  swipeLeft() {
    console.log('left');
    this.element.classList.add('is-open');
  },

  swipeRight() {
    console.log('right');
    this.element.classList.remove('is-open');
  },

  title: '',
  body: ''
});
