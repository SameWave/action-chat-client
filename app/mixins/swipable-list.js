import Ember from 'ember';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

const {
  Mixin,
  inject: {
    service
  },
  computed,
  isEmpty
} = Ember;

export default Mixin.create(RecognizerMixin, {

  scroll: service(),

  recognizers: 'tap pan',

  items: {},
  isItemOpen: false,
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

  isPanDisabled() {
    return this.get('scroll.active'); // Disable when scrolling by default
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
    if (this.isPanDisabled()) {
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
    if (this.isPanDisabled()) {
      return;
    }

    if (this.currentItem) {
      this.currentItem.doPanMove(event);
    }
  },

  panEnd(event) {
    if (this.isPanDisabled()) {
      return;
    }

    if (this.previousItem !== this.currentItem) {
      this.previousItem = this.currentItem;
    }

    if (this.currentItem) {
      this.currentItem.doPanEnd(event);
    }

    this.get('scroll').enable();
  },

  click(event) {
    let clickedItem = this._getItemFromEvent(event);

    if (this.previousItem && this.previousItem.get('isPanOpen')) {
      // Close any other open block
      if (clickedItem !== this.previousItem) {
        this.previousItem.closeItem();
      } else {
        // Close current open block if tapping the front of the open block
        if (this.$(event.target).closest('.js-swipeable-block').length) {
          this.previousItem.closeItem();
        }
      }
    }
  }

});