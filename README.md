# Action-chat-client

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

#### Android

Run $ ember cordova:build --environment=production --platform=android.
Upload apk found in ./ember-cordova/cordova/platforms/android/build/outputs/apk/android-debug.apk to hockeyapp

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)


### SW JS style guide

#### Organizing your modules
```
export default Component.extend({
  // LABEL: Defaults
  tagName: 'div'
  classNames: ['c-auto-resize-textarea'],

  // LABEL: Externally set props
  value: '',

  // Single line CP
  isEmpty: computed.empty('value')

  // LABEL: Multiline CP
  resetSize: computed('value', function() {
    ...
  }),

  // LABEL: Methods
  _resize() {
    ...
  },

  // LABEL: Events
  keyDown() {
    ...
  },

  // LABEL: Lifecycle hooks
	init() {
    this._super(...arguments);
    ...
  },

  actions: {
		someAction() {
			...
		}
  }
});
```

### CSS

#### Style guide

We use a living style guide provided by [Ember Freestyle](http://ember-freestyle.com/). To view the style guide go to the freestyle route
[http://localhost:4200/#/freestyle](http://localhost:4200/#/freestyle)


#### Folder layout
[Style guide](http://cssguidelin.es/)

```
sass/
|
|– abstracts/
|   |– _variables.scss    # Sass Variables
|   |– _functions.scss    # Sass Functions
|   |– _mixins.scss       # Sass Mixins
|   |– _placeholders.scss # Sass Placeholders
|   |– _utitilies.scss    # Sass Utilities
|
|– base/
|   |– _reset.scss        # Reset/normalize
|   |– _typography.scss   # Typography rules and imports
|   …                     # Etc.
|
|– components/
|   |– _buttons.scss      # Buttons
|   |– _chat-box.scss     # Chat box
|   |– _keyboard.scss     # force push for native IOS keyboard
|   |– _message.scss      # Chat messages
|   |– _notice.scss      	# stream notice
|   …                     # Etc.
|
|– layout/
|   |– _navigation.scss   # Navigation
|   |– _header.scss       # Header
|   |– _footer.scss       # Footer
|   |– _sidebar.scss      # Sidebar
|   |– _body.scss         # Sidebar
|   …                     # Etc.
|
|– objects/
|   |– ribbon.scss        # ribbon in stream page
|   …                     # Etc.
|
|– pages/
|   |– stream.scss        # stream specific styles
|   …                     # Etc.
|
|– themes/
|   |– _theme.scss        # Default theme
|   |– _admin.scss        # Admin theme
|   …                     # Etc.
|
|– vendors/
|   |– _materialize.scss    # Materialize
|   …                     # Etc.
|
`– app.scss              # Imports all scss files
```
