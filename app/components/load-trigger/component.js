import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

export default Ember.Component.extend(InViewportMixin, {

  didInsertElement() {
    this._super(...arguments);

    this.setProperties({
      viewportEnabled: true,
      viewportUseRAF: true,
      viewportSpy: true,
      viewportScrollSensitivity: 1,
      viewportRefreshRate: 60,
      viewportTolerance: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    });
  },

  didEnterViewport() {
    if (this.get('doLoadTrigger')) {
      this.get('doLoadTrigger')();
    }
  }

});