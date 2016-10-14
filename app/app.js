import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,

  /*

  ### Event Names - FYI from Ember source

  All of the event handling approaches described above respond to the same set
  of events. The names of the built-in events are listed below. (The hash of
  built-in events exists in `Ember.EventDispatcher`.) Additional, custom events
  can be registered by using `Ember.Application.customEvents`.

  Touch events:

  * `touchStart`
  * `touchMove`
  * `touchEnd`
  * `touchCancel`

  Keyboard events

  * `keyDown`
  * `keyUp`
  * `keyPress`

  Mouse events

  * `mouseDown`
  * `mouseUp`
  * `contextMenu`
  * `click`
  * `doubleClick`
  * `mouseMove`
  * `focusIn`
  * `focusOut`
  * `mouseEnter`
  * `mouseLeave`

  Form events:

  * `submit`
  * `change`
  * `focusIn`
  * `focusOut`
  * `input`

  HTML5 drag and drop events:

  * `dragStart`
  * `drag`
  * `dragEnter`
  * `dragLeave`
  * `dragOver`
  * `dragEnd`
  * `drop`
  */

  customEvents: {
    // Enabled events
    click: 'click',
    focusin: 'focusIn',
    focusout: 'focusOut',
    submit: 'submit',
    input: 'input',
    change: 'change',

    dragstart: 'dragStart',
    drag: 'drag',
    dragenter: 'dragEnter',
    dragleave: 'dragLeave',
    dragover: 'dragOver',
    drop: 'drop',
    dragend: 'dragEnd',

    // Disabled events
    dblclick: null, // doubleClick
    mousedown: null, // mouseDown
    mouseup: null, // mouseUp
    mousemove: null, // mouseMove
    mouseenter: null, // mouseEnter
    mouseleave: null, // mouseLeave

    touchstart: null,
    touchmove: null,
    touchend: null,
    touchcancel: null,

    keydown: null,
    keyup: null,
    keypress: null,

    contextmenu: null,

    // Maps tap to click so that we don't have to handle explicit taps
    tap: 'click'
  }
});

loadInitializers(App, config.modulePrefix);

export default App;