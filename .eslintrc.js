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
    'browser': true
  },
  rules: {
    'object-shorthand': [2, 'consistent-as-needed']
  }
};
