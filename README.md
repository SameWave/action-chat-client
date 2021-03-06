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
* [Cordova](http://)

## Installation
* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`
* `ember cdv:prepare`

## Running / Development

### On local pc
* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### On device against production data
* ember cdv run ios
* ember cdv:s --env=production


### On device against local dev env

In ember-env change following:

```
host: 'http://10.99.220.237:8080',
socket: 'ws://10.99.220.237:8080/cable'
```

NB: Make sure postgres is running

On Server
```
$ rails db:migrate:reset && rails db:seed
$ rails s -b 0.0.0.0 -p 8080
```

On Node
*ember cdv:s

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

## Javascript style guide

### General
Always use closure actions.
Remember data Down actions Up

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

## CSS

TODO: [ ] add_ember_gestures and touchZone

####1. General principles

*"Part of being a good steward to a successful project is realizing that writing code for yourself is a Bad Idea™. If thousands of people are using your code, then write your code for maximum clarity, not your personal preference of how to get clever within the spec." - Idan Gazit*

Don't try to prematurely optimize your code; keep it readable and understandable.
All code in any code-base should look like a single person typed it, even when many people are contributing to it.
Strictly enforce the agreed-upon style.
If in doubt when deciding upon a style use existing, common patterns.


Our methodology is BEM with the use of SUIT prefixes

#### Reading list
[atomic-oobemitscss](https://www.sitepoint.com/atomic-oobemitscss/)
[Atomic design sass](https://www.smashingmagazine.com/2013/08/other-interface-atomic-design-sass/)

### Linters

We use [styleLint](http://stylelint.io/) for enforcing css styleguide.
We follow [Idiomatic css](https://github.com/necolas/idiomatic-css) as a base for our css style guide rules.

To configure the rules use the .stylelintrc file

#### IDE plugins

To get highlighting in sublime install [SublimeLinter Stylelint](https://github.com/kungfusheep/SublimeLinter-contrib-stylelint).

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

## Touch

Using [Ember-gestures](https://github.com/runspired/ember-gestures) powered by [hammer.js](http://hammerjs.github.io/api/) to provide api for working on mobile touch gestures.


## Documentation
[SASSDOC](http://sassdoc.com/)
YUIDOC


## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)