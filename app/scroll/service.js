import Ember from 'ember';

const {
  Service
} = Ember;

export default Service.extend({

  $container: null,
  callback: null,

  enable($container, callback) {
    console.log('enable');
    Ember.debug('scroll enable');
    this.$container = $container;

    // if (callback) {
    //   this.callback = callback;
    // }

    this.$container.on('touchmove', this.onScroll.bind(this));
    this.$container.on('scroll', this.onScroll.bind(this));
  },

  disable() {
    Ember.debug('scroll disable');

    this.$container.off('touchmove', this.onScroll.bind(this));
    this.$container.off('scroll', this.onScroll.bind(this));

    this.$container.css({
      'overflow-y': 'hidden'
    });

  },

  onScroll() {
    console.log('onScroll');
    // console.log(this.callback);
    // if (this.callback) {
    // this.callback();
    // }
    this.$container.css({
      'overflow-y': 'scroll'
    });

  }

});