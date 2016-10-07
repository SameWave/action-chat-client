import Ember from 'ember';
import SwipableListMixin from 'action-chat-client/mixins/swipable-list';

const {
  Component,
  isEmpty,
  $
} = Ember;

export default Component.extend(SwipableListMixin, {

  classNames: ['js-comments-section', 'c-comments-section'],
  $scrollContainer: null,

  didInsertElement() {
    this.$scrollContainer = this.$();
    this._super(...arguments);

    // this.get('scroll').setProperties({
    //   startedCallback: this.scrollStarted.bind(this),
    //   endedCallback: this.scrollEnded.bind(this),
    // });

  },

  willDestroyElement() {
    this._super(...arguments);
    this.$scrollContainer = null;
  }

});