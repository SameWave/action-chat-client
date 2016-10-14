import Ember from 'ember';

const {
  Mixin,
  run,
  testing
} = Ember;

export default Mixin.create({

  classNames: ['js-list-item'],
  classNameBindings: ['isOpen'],

  isOpen: false,
  isSwipable: true,
  isPanOpen: false,
  optionWidth: 284,

  init() {
    this._super(...arguments);

    // Check that registerItem function exists on parentView
    if (this.get('parentView').registerItem) {
      this.get('parentView').registerItem(this);
    }

  },

  didInsertElement() {
    this._super(...arguments);
    this.$front = this.$('.js-swipeable-block')[0];
  },

  willDestroyElement() {
    this._super(...arguments);
    this.$front = null;
  },

  closeItem() {
    let style = '';

    style += 'transform: translateX(0); transition: transform 250ms;';

    this.$front.style.cssText = style;
  },

  doPanStart() {
    if (!this.$front) {
      return;
    }
    // this.get('ui').own(this.get('elementId'), this.close.bind(this));

    let style = window.getComputedStyle(this.$front);
    // TODO: What is this? Use window.getComputedStyle(el).getPropertyValue("translate")
    let matrix = new WebKitCSSMatrix(style.webkitTransform);

    this.startX = matrix.m41;

    if (!testing) {
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
    let width = this.get('optionWidth');
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

    let width = this.get('optionWidth');
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

  // Note: Called every pixel the element is dragged
  animatePan() {

    this.rafPanId = null;

    let newX = this.lastX;

    this.$front.style.cssText = `transform: translateX(${ newX }px)`;
  },

  // Note: Called at the end of a drag. Used to autoclose or open when dragging is stopped midway
  animateSlide() {

    if (!this.$front) {
      return;
    }

    this.rafSlideId = null;

    let newX,
      relativeDuration;
    let width = this.get('optionWidth');

    // Checks whether to snap open or close
    newX = (this.get('isPanOpen')) ? -1 * width : 0;

    // calculate the remaining duration (time) needed to complete the action
    // relativeDuration = Math.abs(newX - this.lastX) / (this.get('clip') / this.get('duration'));
    relativeDuration = 120;

    this.$front.style.cssText = `transition: transform ${ relativeDuration }ms; transform: translateX(${ newX }px); `;

    if (newX === 0) {

      this.slideTimer = run.later(this, function() {
        if (this.get('isDestroying') || this.get('isDestroyed')) {
          return;
        }
        this.$front.style.cssText = '';
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
  }.observes('isPanOpen')

});