import Ember from 'ember';

const {
  Component
} = Ember;

export default Component.extend({
  classNames: ['c-message-marker'],
  attributeBindings: ['style'],

  top: -100,

  style: function() {
    return (`top: ${this.get('top')}px`).htmlSafe();
  }.property('top')
});
