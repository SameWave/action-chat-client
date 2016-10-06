import Ember from 'ember';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

const {
  Mixin,
  inject: {
    service
  }
} = Ember;

export default Mixin.create(RecognizerMixin, {

  scroll: service(),

  recognizers: 'tap swipe pan',

  items: {},
  previousItem: null,
  currentItem: null,
  onScrollCallback: null,
  $scrollContainer: null,

  didInsertElement() {
    console.log('swipe didInsertElement');
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

  registerItem(item) {
    if (item) {
      this.get('items')[item.get('elementId')] = item;
    }
  },

  swipeLeft(event) {
    console.log('swipeLeft');

    if (this.get('scroll.active')) {
      return;
    }

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
    console.log('swipeRight');

    if (this.get('scroll.active')) {
      return;
    }

    this.get('scroll').disable();

    this.currentItem = this._getItemFromEvent(event);

    if (this.currentItem) {
      this.currentItem.doSwipeRight(event);
    }

    if (this.$scrollContainer) {
      this._enableScroll();
    }
  },

  panStart(event) {
    console.log('panStart');

    if (this.get('scroll.active')) {
      return;
    }

    // this.previousItem = this.currentItem;
    this.currentItem = this._getItemFromEvent(event);

    // if (this.previousItem) {
    //   this.previousItem.doSwipeRight(event);
    // }

    if (this.currentItem) {
      this.currentItem.doPanStart(event);
    }

    // if (this.$scrollContainer) {
    //   this._enableScroll();
    // }
  },

  panMove(event) {
    console.log('panMove');
    if (this.currentItem) {
      this.currentItem.doPanMove(event);
    }
  },

  panEnd(event) {
    console.log('panEnd');
    if (this.get('scroll.active')) {
      return;
    }
    if (this.currentItem) {
      this.currentItem.doPanEnd(event);
    }

    // this.get('scroll').enable();
  }

});