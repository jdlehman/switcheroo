import {assert} from 'chai';
import {removeTrailingSlash} from 'helpers';

describe('helpers', function() {
  describe('removeTrailingSlash', function() {
    it('removes trailing slash to path with it', function() {
      var path = '/test/something/more';
      var newPath = removeTrailingSlash(`${path}/`);
      assert.equal(newPath, path);
    });

    it('returns unmodified path if it does not have a trailing slash', function() {
      var path = '/test/something/more';
      var newPath = removeTrailingSlash(path);
      assert.equal(newPath, path);
    });

    it('returns unmodified path if path is /', function() {
      var path = '/';
      var newPath = removeTrailingSlash(path);
      assert.equal(newPath, path);
    });
  });
});
