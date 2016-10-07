import Ember from 'ember';

const {
  Mixin,
  run
} = Ember;

export default Mixin.create({

  classNames: ['js-list-item'],
  classNameBindings: ['isOpen'],

  isOpen: false,
  isSwipable: true,
  isPanOpen: false,

  init() {
    this._super(...arguments);

    // Check that registerItem function exists on parentView
    if (this.get('parentView').registerItem) {
      this.get('parentView').registerItem(this);
    }

  },

  didInsertElement() {
    this._super(...arguments);
    this.$front = this.$('.l-stream-comment_front')[0];
  },

  willDestroyElement() {
    this._super(...arguments);
    this.$front = null;
  },

  doSwipeRight() {
    if (this.get('isSwipable')) {
      // this.set('isOpen', false);
      this.set('isPanOpen', false);
    }
  },

  doPanStart() {

    if (!this.$front) {
      return;
    }
    // this.get('ui').own(this.get('elementId'), this.close.bind(this));

    var style = window.getComputedStyle(this.$front);
    var matrix = new WebKitCSSMatrix(style.webkitTransform);

    this.startX = matrix.m41;
    this.startY = matrix.m42;
    this.startZ = matrix.m43;

    if (!Ember.testing) {
      this.lastX = this.startX;
    }

    if (this.rafSlideId) {
      window.cancelAnimationFrame(this.rafSlideId);
      this.rafSlideId = null;
    }

    // keep track that we're panning
    // this.set('isPanning', true);
  },

  doPanMove(event) {

    let newX = Math.round(this.startX + event.originalEvent.gesture.deltaX);
    let width = 284;
    newX = Math.min(Math.max(newX, -1 * width), 0);
    if (this.lastX === newX) {
      return;
    }

    this.lastX = newX;

    if (!this.rafPanId) {
      this.rafPanId = window.requestAnimationFrame(this.animatePan.bind(this));
    }
  },

  doPanEnd() {
    this.startX = null;

    let width = 284;
    let clip = Math.round((width / 2), 0);

    this.setProperties({
      isPanning: false,
      isPanOpen: (Math.abs(this.lastX) >= clip)
    });

    // if (!this.get('isPanOpen')) {
    //   this.get('ui').disown(this.get('elementId'));
    // }

    if (this.rafPanId) {
      window.cancelAnimationFrame(this.rafPanId);
      this.rafPanId = null;
    }

    if (!this.rafSlideId) {
      this.rafSlideId = window.requestAnimationFrame(this.animateSlide.bind(this));
    }
  },

  animatePan() {
    this.rafPanId = null;

    var newX = this.lastX,
      style = '';

    style += '-webkit-transition: none; ';
    style += '-moz-transition: none; ';
    style += '-ms-transition: none; ';
    style += '-o-transition: none; ';
    style += 'transition: none; ';

    style += '-webkit-transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px) scale3d(1,1,1); ';
    style += '-moz-transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px); ';
    style += '-ms-transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px); ';
    style += '-o-transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px); ';
    style += 'transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px); ';

    this.$front.style.cssText = style;
  },

  animateSlide() {
    if (!this.$front) {
      return;
    }

    this.rafSlideId = null;

    let width = 284;
    var newX,
      relativeDuration,
      animation = 'linear';

    console.log(this.get('isPanOpen'));
    newX = (this.get('isPanOpen')) ? -1 * width : 0;

    // calculate the remaining duration (time) needed to complete the action
    // relativeDuration = Math.abs(newX - this.lastX) / (this.get('clip') / this.get('duration'));

    // relativeDuration = this.get('duration');
    relativeDuration = 120;

    var style = '';

    style += '-webkit-transition: -webkit-transform ' + relativeDuration + 'ms ' + animation + '; ';
    style += '-moz-transition: -moz-transform ' + relativeDuration + 'ms ' + animation + '; ';
    style += '-ms-transition: -ms-transform ' + relativeDuration + 'ms ' + animation + '; ';
    style += '-o-transition: -o-transform ' + relativeDuration + 'ms ' + animation + '; ';
    style += 'transition: transform ' + relativeDuration + 'ms ' + animation + '; ';

    style += '-webkit-transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px) scale3d(1,1,1); ';
    style += '-moz-transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px); ';
    style += '-ms-transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px); ';
    style += '-o-transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px); ';
    style += 'transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px); ';


    this.$front.style.cssText = style;

    if (newX === 0) {

      this.slideTimer = run.later(this, function() {
        if (this.get('isDestroying') || this.get('isDestroyed')) {
          return;
        }
        this.$front.style.cssText = "";
      }, relativeDuration);
    }
  },

  _enqueSlide: function() {

    if (this.get('isDestroying') || this.get('isDestroyed')) {
      return;
    }

    if (this.rafPanId) {
      window.cancelAnimationFrame(this.rafPanId);
      this.rafPanId = null;
    }

    if (!this.rafSlideId) {
      this.rafSlideId = window.requestAnimationFrame(this.animateSlide.bind(this));
    }
  }.observes('isPanOpen'),

});