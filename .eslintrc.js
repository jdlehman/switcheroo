module.exports = {
  plugins: ['prettier'],

  extends: ['prettier', 'prettier/react'],
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],

  env: {
    browser: true,
    es6: true,
    node: true,
    'jest/globals': true
  },

  globals: {
    require: true,
    process: true,
    global: true,
    module: true,
    // from jest
    expect: true
  },

  rules: {
    'prettier/prettier': ['error', { singleQuote: true }]
  }
};
