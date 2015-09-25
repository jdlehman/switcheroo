import {assert} from 'chai';
import {ensureTrailingSlash} from 'helpers';

describe('helpers', function() {
  describe('ensureTrailingSlash', function() {
    it('adds trailing slash to path without it', function() {
      var path = '/test/something/more';
      var newPath = ensureTrailingSlash(path);
      assert.equal(newPath, `${path}/`);
    });

    it('returns unmodified path if it already has trailing slash', function() {
      var path = '/test/something/more/';
      var newPath = ensureTrailingSlash(path);
      assert.equal(newPath, path);
    });
  });
});
