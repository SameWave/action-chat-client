import Ember from 'ember';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

const {
  Mixin,
  inject: {
    service
  },
  $
} = Ember;

export default Mixin.create(RecognizerMixin, {

  scroll: service(),

  recognizers: 'tap swipe',

  items: {},
  previousItem: null,
  currentItem: null,
  onScrollCallback: null,
  $scrollContainer: null,

  didRender() {
    console.log('swipe didRender');
    this._super(...arguments);

    if (this.$scrollContainer) {
      this._enableScroll();
    }
  },

  _enableScroll() {
    this.get('scroll').enable(this.$scrollContainer, this.onScrollCallback);
  },

  _getItemFromEvent(event) {
    let itemId = this.$(event.target).closest('.js-list-item').attr('id');
    return this.get('items')[itemId];
  },

  swipeLeft(event) {
    this.get('scroll').disable();

    this.previousItem = this.currentItem;
    this.currentItem = this._getItemFromEvent(event);

    if (this.previousItem) {
      this.previousItem.doSwipeRight(event);
    }

    if (this.currentItem) {
      this.currentItem.doSwipeLeft(event);
    }

    if (this.$scrollContainer) {
      this._enableScroll();
    }
  },

  swipeRight(event) {
    this.get('scroll').disable();

    this.currentItem = this._getItemFromEvent(event);

    if (this.currentItem) {
      this.currentItem.doSwipeRight(event);
    }

    if (this.$scrollContainer) {
      this._enableScroll();
    }
  },

  registerItem(item) {
    if (item) {
      this.get('items')[item.get('elementId')] = item;
    }
  }

});