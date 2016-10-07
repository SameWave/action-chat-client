import Ember from 'ember';

const {
  Service,
  run: {
    debounce,
    cancel,
    later
  },
  testing
} = Ember;

const momentumDelay = testing ? 0 : 10;

export default Service.extend({

  $container: null,
  callback: null,

  // states
  active: false,
  started: false,
  ended: true,
  momentumTimer: null,

  isIOS() {
    return window.cordova && window.cordova.platformId === 'ios';
  },

  enable($container, callback) {
    // console.log('enable');
    this.$container = $container;

    // if (callback) {
    //   this.callback = callback;
    // }

    this.$container.css({
      'overflow-y': 'scroll'
    });

    // this.$container.on('touchmove', this.onScroll.bind(this));
    this.$container.on('scroll', this.onScroll.bind(this));
  },

  disable() {
    // this.$container.off('touchmove', this.onScroll.bind(this));
    this.$container.off('scroll', this.onScroll.bind(this));

    this.$container.css({
      'overflow-y': 'hidden'
    });

  },

  onScroll() {
    // console.log('onScroll');

    if (this.get('ended') && !this.get('started')) {
      debounce(this, this.start, 251, true);
    }

    if (this.get('started') && !this.get('ended')) {
      debounce(this, this.end, 250);
    }
  },

  start() {
    console.log('started scrolling');
    this.setProperties({
      started: true,
      active: true,
      ended: false
    });

    // once(this, this.hideKeyboard);

    // if (this.get('ui.activeElementId')) {
    //   this.get('ui').play();
    // }

    // if (this.get('startedCallback')) {
    //   this.get('startedCallback')();
    // }
  },

  end() {
    // console.log('ended scrolling');
    this.setProperties({
      started: false,
      ended: true
    });

    // prevent inputs catching focus
    if (this.isIOS()) {
      cancel(this.momentumTimer);
      this.momentumTimer = later(this, function() {
        this.set('active', false);
      }, momentumDelay);
    } else {
      this.set('active', false);
    }

    // if (this.get('endedCallback')) {
    //   this.get('endedCallback')();
    // }

  }

});