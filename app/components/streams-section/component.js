import Ember from 'ember';
import SwipableListMixin from 'action-chat-client/mixins/swipable-list'

export default Ember.Component.extend(SwipableListMixin, {

  tagName: 'section',
  classNames: ['l-app-body--streams'],

  streams: []
});