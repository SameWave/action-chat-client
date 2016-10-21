import Ember from 'ember';

const {
  Service,
  run: {
    debounce,
    cancel,
    later
  },
  testing,
  $
} = Ember;

const momentumDelay = testing ? 0 : 10;

export default Service.extend({

  callback: null,

  // states
  active: false,
  started: false,
  ended: true,
  momentumTimer: null,
  triggerLoadEarlier: null,

  isIOS() {
    return window.cordova && window.cordova.platformId === 'ios';
  },

  enable($container) {
    $container.css({
      'overflow-y': 'scroll'
    });
    $container.on('scroll', this.onScroll.bind(this, $container));
  },

  disable($container) {
    $container.off('scroll');
    $container.css({
      'overflow-y': 'hidden'
    });
  },

  onScroll($container) {
    if (this.get('ended') && !this.get('started')) {
      debounce(this, this.start, 251, true);
    }

    if (this.get('started') && !this.get('ended')) {
      debounce(this, this.end, 250);
    }

    // console.log($container.scrollTop());
    if ($container.scrollTop() < 10) {
      this.get('triggerLoadEarlier')();
    }
  },

  start() {
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