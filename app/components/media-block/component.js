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
  attributeBindings: ['draggable'],
  drag: true,

  title: '',
  date: '',
  body: '',

  didInsertElement() {
    console.log(`title: ${this.get('title')}`);
  },

  swipeLeft() {
    this.set('isOpen', true);
  },

  swipeRight() {
    this.set('isOpen', false);
  },

  panUp(e) {
    let gesture = e.originalEvent.gesture;
    console.log(`e: ${gesture}`);
  },

  panStart(e) {
    let gesture = e.originalEvent.gesture;
    console.log(`panStar: ${gesture}`);
  },

  tap() {
    if (this.get('onTap')) {
      this.get('onTap')();
    }
  }
});