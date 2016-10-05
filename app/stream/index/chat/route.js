import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  Route,
  RSVP,
  inject: {
    service
  },
  run,
  computed: {
    alias
  },
  isEmpty
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {

  session: service(),
  cable: service(),
  sessionPerson: alias('session.person'),

  model() {
    let {
      stream
    } = this.modelFor('stream.index');
    return RSVP.hash({
      stream,
      comments: this.store.peekAll('comment'),
      members: this.store.peekAll('member')
    });
  },

  setupController(controller, model) {
    let {
      stream,
      comments,
      members
    } = model;

    let streamMembers = members.filterBy('stream.id', stream.get('id'));
    let sessionMember = streamMembers.findBy('person.id', this.get('sessionPerson.id'));

    let previousLastReadAt, unreadCount;

    if (isEmpty(sessionMember)) {
      previousLastReadAt = Date();
      unreadCount = 0;
    } else {
      previousLastReadAt = sessionMember.get('lastReadAt');
      unreadCount = sessionMember.get('unreadCount');
    }

    controller.setProperties({
      totalCommentCount: stream.get('commentCount'),
      previousLastReadAt: previousLastReadAt,
      unreadCount: unreadCount,
      comments,
      members,
      stream
    });
  },

  actions: {

    didTransition() {
      run.schedule('afterRender', this, () => {
        this.get('controller').didRender();
      });
    },

    willTransition() {
      this.get('controller').setProperties({
        isObserving: false,
        unreadCount: 0,
        isLoadingEarlier: false,
        totalCommentCount: 0,
        isMentionListVisible: false,
        isChatModalVisible: false,
        typingTimer: null,
        chatBoxValue: '',
        loadingTimer: null,
        selectedComment: null,
        firstUnread: null,
        $comments: null,
        $chatBox: null,
        $input: null
      });
    }
  }
});