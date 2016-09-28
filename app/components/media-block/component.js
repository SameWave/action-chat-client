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
    this.element.classList.add('is-open');
  },

  swipeRight() {
    this.element.classList.remove('is-open');
  },

  tap() {
    if (this.get('onTap')) {
      this.get('onTap')();
    }
  }
});