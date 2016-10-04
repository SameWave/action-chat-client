import Ember from 'ember';

const {
  TextArea,
  run,
  observer
} = Ember;

export default TextArea.extend({
  classNames: ['c-auto-resize-textarea'],

  value: '',

  valueObserver: observer('value', function() {
    this._resize();

    if (this.get('onChange')) {
      this.get('onChange')(this.get('value'));
    }
  }),

  _resize() {
    let textArea = this.element;

    run.debounce(this, function() {
      textArea.style.cssText = 'height:auto; padding:0';
      textArea.style.cssText = `height:${textArea.scrollHeight}px`;
    }, 50);
  }
});