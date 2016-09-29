// Component
import Ember from 'ember';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

const {
  Component
} = Ember;

export default Component.extend(RecognizerMixin, {
  tagName: 'button',
  classNameBindings: [':button', 'type', 'colour', 'isActive', 'isDisabled'],
  colour: '',
  type: 'standard',
  isActive: false,
  isDisabled: false,
  recognizers: 'tap'
});