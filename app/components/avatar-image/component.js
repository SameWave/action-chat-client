import Ember from 'ember';

const {
	Component
} = Ember;

export default Component.extend({
  classNames: ['c-avatar-image'],
  classNameBindings: ['isSmall:c-avatar-image--small', 'isMedium:c-avatar-image--medium', 'large:c-avatar-image--large', 'isGreen'],
  isSmall: false,
  isMedium: true,
  large: false,
  isGreen: false
});
