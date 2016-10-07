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

  // recognizers: 'tap pan',
  recognizers: 'tap',

  items: {},
  previousItem: null,
  currentItem: null,
  onScrollCallback: null,
  $scrollContainer: null,

  didInsertElement() {
    this._super(...arguments);
    this._enableScroll();
  },

  _enableScroll() {
    if (this.$scrollContainer) {
      this.get('scroll').enable(this.$scrollContainer, this.onScrollCallback);
    }
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

  // panStart(event) {
  //   console.log(this.get('scroll.active'));
  //   if (this.get('scroll.active')) {
  //     return;
  //   }

  //   this.get('scroll').disable();

  //   this.currentItem = this._getItemFromEvent(event);

  //   if (this.previousItem) {
  //     this.previousItem.doSwipeRight(event);
  //   }

  //   if (this.currentItem) {
  //     this.currentItem.doPanStart(event);
  //   }
  // },

  // panMove(event) {

  //   if (this.get('scroll.active')) {
  //     return;
  //   }

  //   if (this.currentItem) {
  //     this.currentItem.doPanMove(event);
  //   }
  // },

  // panEnd(event) {
  //   if (this.get('scroll.active')) {
  //     return;
  //   }

  //   this.previousItem = this.currentItem;

  //   if (this.currentItem) {
  //     this.currentItem.doPanEnd(event);
  //     // this.currentItem = null;
  //   }

  //   this._enableScroll();
  // }

});