import Ember from 'ember';
import SwipableListItemMixin from 'action-chat-client/mixins/swipable-list-item';

const {
	Component,
	computed
} = Ember;

export default Component.extend(SwipableListItemMixin, {
  classNames: ['c-media-block--stream'],

  stream: null,
  title: computed.alias('stream.title'),
  body: computed.alias('stream.lastComment.body'),
  members: 'double dragon',
  date: computed.alias('stream.lastCommentedAt')
});
