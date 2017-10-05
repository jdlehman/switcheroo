module.exports = {
  plugins: ['prettier'],

  env: {
    browser: true,
    es6: true
  },

  parser: 'babel-eslint',

  extends: ['prettier', 'prettier/react'],

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
