import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

const {
  Component,
  computed,
  isEmpty,
  on,
  setProperties
} = Ember;

export default Component.extend(InViewportMixin, {

  // @mo TODO: add CSS for the has-fade-out class (or similar)

  classNameBindings: [':c-message-marker', 'hasFadeOut'],
  attributeBindings: ['style'],

  hasFadeOut: false,

  viewportOptionsOverride: on('didInsertElement', function() {
    setProperties(this, {
      viewportEnabled: true,
      viewportUseRAF: true,
      viewportSpy: false,
      viewportScrollSensitivity: 1,
      viewportRefreshRate: 150,
      viewportTolerance: {
        top: -(65 + 34), // height of header + tab menu
        bottom: 0,
        left: 0,
        right: 0
      }
    });
  }),

  didEnterViewport() {
    this.set('hasFadeOut', true);
  }

});