/* global autoScroll */
import Ember from 'ember';
import EmberDragulaContainer from 'ember-dragula/components/ember-dragula-container';
import SwipableListMixin from 'action-chat-client/mixins/swipable-list';

const {
  inject,
  $
} = Ember;

export default EmberDragulaContainer.extend(SwipableListMixin, {
  scroll: inject.service(),
  drake: null,

  didInsertElement() {

    this._super(...arguments);

    let drake = this.get('drake');

    let scroll = autoScroll($('.l-app-body--stream'), {
      margin: 50, // TODO: Make sure this is the correct margin
      pixels: 5,
      scrollWhenOutside: true,
      autoScroll() {
        // Only scroll when the pointer is down, and there is a child being dragged.
        return this.down && drake.dragging;
      }
    });
  },

  isPanDisabled() {
    return this.get('scroll.active') || this.get('drake.dragging');
  },

  // TODO: Understand why this is needed explicitly on the scoreboard
  tap(event) {
    this.click(event);
  }
});