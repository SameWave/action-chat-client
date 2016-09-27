import Ember from 'ember';

const {
  Component
} = Ember;

export default Component.extend({
  classNameBindings: [':c-chat-notifier'],
  lastReadAt: null,
  unreadOffScreenCount: 0,

  actions: {
    tapArrowUp() {
      if (this.get('onTapArrowUp')) {
        this.get('onTapArrowUp')();
      }
    },

    tapBody() {
      if (this.get('onTapBody')) {
        this.get('onTapBody')();
      }
    },

    tapClose() {
      if (this.get('onTapClose')) {
        this.get('onTapClose')();
      }
    }
  }
});