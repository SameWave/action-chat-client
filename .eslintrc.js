module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:ember-suave/recommended'
  ],
  plugins: [
    'ember-suave'
  ],
  env: {
    'browser': true,
    'node': true,
    'es6': true,
    'qunit': true
  },
  rules: {
    'object-shorthand': ["error", "always", {
      "ignoreConstructors": true
    }]
  }
};