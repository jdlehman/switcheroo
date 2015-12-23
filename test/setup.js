import {jsdom} from 'jsdom';

process.env.NODE_ENV = 'test';
process.env.BABEL_ENV = 'test';

global.document = jsdom('<!doctype html><html><body><div id="app"></div></body></html>', {
  url: 'http://test.page'
});
global.window = document.defaultView;
global.self = global.window;
global.navigator = global.window.navigator;
