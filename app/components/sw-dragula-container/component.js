import EmberDragulaContainer from 'ember-dragula/components/ember-dragula-container';
import SwipableListMixin from 'action-chat-client/mixins/swipable-list';

export default EmberDragulaContainer.extend(SwipableListMixin, {

  drake: null,

  didInsertElement() {

    this._super(...arguments);

    let drake = this.get('drake');

    let scroll = autoScroll($(".l-app-body--stream"), {
      margin: 50, // TODO: Make sure this is the correct margin
      pixels: 5,
      scrollWhenOutside: true,
      autoScroll() {
        // Only scroll when the pointer is down, and there is a child being dragged.
        return this.down && drake.dragging;
      }
    });
  }

});