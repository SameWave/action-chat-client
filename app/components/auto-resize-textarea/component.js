import Ember from 'ember';
import { animate } from 'liquid-fire';

const {
  TextArea,
  run
} = Ember;

export default TextArea.extend({
  classNames: ['c-auto-resize-textarea'],

  _resize() {
    let textArea = this.$();

    run.later(this, function() {
      run.throttle(this, function() {
        textArea[0].style.cssText = 'height:auto; padding:0';
        animate(textArea, { height: `${textArea[0].scrollHeight}px` });
      }, 50);
      // debugger;
      // animate(textArea, { height: 'auto', padding: 0 });
      // textArea.style.cssText = `height:${textArea.scrollHeight}px`;
    }, 0);
  },

  keyDown() {
    this._resize();
    if (this.get('onKeyDown')) {
      this.get('onKeyDown')();
    }
  },

  keyUp() {
    if (this.get('onKeyUp')) {
      this.get('onKeyUp')();
    }
  },

  focusIn() {
    if (this.get('onFocusIn')) {
      this.get('onFocusIn')();
    }
  },

  focusOut() {
    if (this.get('onFocusOut')) {
      this.get('onFocusOut')();
    }
  }

});