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

  recognizers: 'tap pan',

  items: {},
  previousItem: null,
  currentItem: null,
  onScrollCallback: null,
  $scrollContainer: null,

  didInsertElement() {
    this._super(...arguments);
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

  /**
  * Event fired when user initiates dragging.
  This event disables scrolling on the container.
  This event closes the previous opened item.
  *
  * @event panStart
  * @requires ember-gestures
  * @param {object} returned touch event
  */
  panStart(event) {
    if (this.get('scroll.active')) {
      return;
    }

    this.get('scroll').disable();

    this.currentItem = this._getItemFromEvent(event);

    if (this.previousItem) {
      this.previousItem.closeItem();
    }

    if (this.currentItem) {
      this.currentItem.doPanStart(event);
    }
  },

  panMove(event) {
    if (this.get('scroll.active')) {
      return;
    }

    if (this.currentItem) {
      this.currentItem.doPanMove(event);
    }
  },

  panEnd(event) {
    if (this.get('scroll.active')) {
      return;
    }

    if (this.previousItem !== this.currentItem) {
      this.previousItem = this.currentItem;
    }

    if (this.currentItem) {
      this.currentItem.doPanEnd(event);
      // this.currentItem = null;
    }

    this.get('scroll').enable();
  }

});