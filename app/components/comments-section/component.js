import Ember from 'ember';
import SwipableListMixin from 'action-chat-client/mixins/swipable-list';

const {
  Component,
  isEmpty,
  $
} = Ember;

export default Component.extend(SwipableListMixin, {

  classNames: ['js-comments-section', 'c-comments-section'],
  editingComment: null,
  $scrollContainer: null,

  didRender() {
    console.log('comment section didRender');
    this.$scrollContainer = $('.js-comments-section');
    this._super(...arguments);
  },

  tap() {
    if (isEmpty(this.get('editingComment'))) {
      $('#chat-area').blur();
    }
  }
});