import Ember from 'ember';
import SwipableListMixin from 'action-chat-client/mixins/swipable-list';

const {
  Component,
  isEmpty,
  $
} = Ember;

export default Component.extend(SwipableListMixin, {

  classNames: ['js-comments-section', 'c-comments-section']
});