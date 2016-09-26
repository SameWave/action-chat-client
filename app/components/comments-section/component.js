import Ember from 'ember';

const {
  Component,
  computed,
  $
} = Ember;

export default Component.extend({
  classNames: ['c-comments-section'],
  sessionMember: null,
  newMessagesTop: -100,

  comments: [],
  sortProperties: ['createdAt', 'id'],
  sortedComments: computed.sort('comments', 'sortProperties'),

  unreadComments: computed('sortedComments.@each.createdAt', 'sessionMember.lastReadAt', function() {
    return this.get('sortedComments').filter((comment) => {
      return comment.get('createdAt') > this.get('sessionMember.lastReadAt');
    })
  }),

  didRender() {
    this._super(...arguments);

    let unreadComments = this.get('unreadComments');
    if (unreadComments.get('length')) {
      let firstUnreadId = unreadComments.get('firstObject.id');
      let $unreadComment = $(`#comment-${firstUnreadId}`);
      this.set('newMessagesTop', $unreadComment.position().top);
    }
  },

  actions: {
    doTap() {
      $('#chat-area').blur();
    }
  }
});