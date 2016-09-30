import Ember from 'ember';
import SwipableListItemMixin from 'action-chat-client/mixins/swipable-list-item';

const {
  Component
} = Ember;

export default Component.extend(SwipableListItemMixin, {
  classNames: ['c-media-block'],

  title: '',
  date: '',
  body: ''
});