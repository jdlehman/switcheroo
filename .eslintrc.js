module.exports = {
  plugins: ['prettier'],

  extends: [
    'panoply',
    'panoply/browser',
    'panoply/mocha',
    'panoply/react',
    'prettier',
    'prettier/react'
  ],

  globals: {
    require: true,
    process: true,
    global: true,
    module: true
  },

  rules: {
    'prettier/prettier': ['error', { singleQuote: true }]
  }
};
