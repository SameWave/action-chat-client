import Ember from 'ember';

const {
	Component,
	computed
} = Ember;

export default Component.extend({
  classNames: ['c-media-block--stream'],

  stream: null,
  title: computed.alias('stream.title'),
  body: computed.alias('stream.lastComment.body'),
  members: 'double dragon',
  date: computed.alias('stream.lastCommentedAt')
});
