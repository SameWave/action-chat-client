import Ember from 'ember';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

export default Ember.Mixin.create(RecognizerMixin, {

  recognizers: 'swipe',

  items: {},
  currentItem: null,

  _getItemFromEvent(event) {
    let itemId = this.$(event.target).closest('.js-list-item').attr('id');
    return this.get('items')[itemId];
  },

  swipeLeft(event) {

    this.currentItem = this._getItemFromEvent(event);

    if (this.currentItem) {
      this.currentItem.doSwipeLeft(event);
    }
  },

  swipeRight(event) {
    this.currentItem = this._getItemFromEvent(event);

    if (this.currentItem) {
      this.currentItem.doSwipeRight(event);
    }
  },

  actions: {
    registerItem(item) {
      if (item) {
        this.get('items')[item.get('elementId')] = item;
      }
    }
  }

});