import Ember from 'ember';
import moment from 'moment';
import FreestyleController from 'ember-freestyle/controllers/freestyle';

const { inject } = Ember;

export default FreestyleController.extend({
  emberFreestyle: inject.service(),

  /* BEGIN-FREESTYLE-USAGE fp:notes
### A few notes regarding freestyle-palette

- Accepts a colorPalette POJO like the one found in the freestyle.js blueprint controller
- Looks very nice

And another thing...

###### Markdown note demonstrating prettified code

```
import Ember from 'ember';

export default Ember.Component.extend({
  // ...
  colorPalette: {
    'primary': {
      'name': 'cyan',
      'base': '#00bcd4'
    },
    'accent': {
      'name': 'amber',
      'base': '#ffc107'
    }
  }
  // ...
});
```
  END-FREESTYLE-USAGE */

  colorPalette: {
    'primary': {
      'name': 'cyan',
      'base': '#00bcd4'
    },
    'accent': {
      'name': 'amber',
      'base': '#ffc107'
    },
    'secondary': {
      'name': 'greyish',
      'base': '#b6b6b6'
    },
    'foreground': {
      'name': 'blackish',
      'base': '#212121'
    },
    'background': {
      'name': 'white',
      'base': '#ffffff'
    }
  },

  comment: {
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident, ab dolorem. Perferendis consequatur quibusdam dolores, voluptas iste commodi natus provident. Quos quas magni qui tenetur, officiis quis vero, itaque aut!',
    person: {
      name: 'Monde Sineke'
    },
    createdAt: moment('2016-11-19 08:30')
  }
});
