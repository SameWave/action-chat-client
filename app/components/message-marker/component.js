import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

const {
  Component,
  on,
  setProperties
} = Ember;

export default Component.extend(InViewportMixin, {
  classNameBindings: [':c-message-marker', 'isViewed:has-fade-out'],

  isViewed: false,

  didInsertElement() {
    this._super(...arguments);
    this.setProperties({
      viewportEnabled: true,
      viewportUseRAF: true,
      viewportSpy: false,
      viewportScrollSensitivity: 1,
      viewportRefreshRate: 100,
      viewportTolerance: {
        top: -(65 + 34), // height of header + tab menu
        bottom: 0,
        left: 0,
        right: 0
      }
    });
  },

  didEnterViewport() {
    if (!this.get('isViewed')) {
      this.set('isViewed', true);
      if (this.get('onView')) {
        this.get('onView')();
      }
    }
  }

});