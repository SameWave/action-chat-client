import Ember from 'ember';
import SwipableListMixin from 'action-chat-client/mixins/swipable-list'

const {
  Component,
  isEmpty
} = Ember;

export default Component.extend(SwipableListMixin, {
  classNames: ['c-comments-section'],
  sessionMember: null,
  comments: [],
  firstUnread: null,
  selectedComment: null,

  tap() {
    if (isEmpty(this.get('selectedComment'))) {
      $('#chat-area').blur();
    }
  }

});