import 'regenerator-runtime/runtime';

global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};
