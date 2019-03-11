module.exports = {
  testRegex: '_test.js$',
  testURL: 'http://localhost',
  rootDir: 'test',
  setupFiles: ['<rootDir>/polyfills.js'],  
  setupFilesAfterEnv: ['jest-dom/extend-expect']
};
