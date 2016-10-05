import Ember from 'ember';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

const {
  Mixin
} = Ember;

export default Mixin.create(RecognizerMixin, {

  recognizers: 'tap swipe',

  items: {},
  previousItem: null,
  currentItem: null,

  _getItemFromEvent(event) {
    let itemId = this.$(event.target).closest('.js-list-item').attr('id');
    return this.get('items')[itemId];
  },

  swipeLeft(event) {
    this.previousItem = this.currentItem;
    this.currentItem = this._getItemFromEvent(event);

    if (this.previousItem) {
      this.previousItem.doSwipeRight(event);
    }

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

  registerItem(item) {
    if (item) {
      this.get('items')[item.get('elementId')] = item;
    }
  }

});