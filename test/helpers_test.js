import {assert} from 'chai';
import React from 'react';
import {
  removeTrailingSlash,
  currentPath,
  createRegexFromPaths,
  formatPathRegex,
  getSwitch,
  replaceDynamicSegments,
  getDynamicSegmentNames,
  getDynamicSegments
} from 'helpers';

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

  describe('currentPath', function() {
    describe('using location.hash', function() {
      it('gets hash by default', function() {
        window.location.hash = '/path';
        var path = currentPath('hash');
        assert.equal(path, '/path');
      });

      it('ensures that path is prepended with a slash', function() {
        window.location.hash = 'path';
        var path = currentPath('hash');
        assert.equal(path, '/path');
      });

      it('does not include query parameters', function() {
        window.location.hash = '/path?a=2&b=3&c=hello';
        var path = currentPath('hash');
        assert.equal(path, '/path');
      });
    });

    describe('using location.pathname', function() {
      it('gets hash by default', function() {
        window.history.pushState({}, '', '/path');
        var path = currentPath('pathname');
        assert.equal(path, '/path');
      });

      it('ensures that path is prepended with a slash', function() {
        window.history.pushState({}, '', 'path');
        var path = currentPath('pathname');
        assert.equal(path, '/path');
      });

      it('does not include query parameters', function() {
        window.history.pushState({}, '', '/path?a=2&b=3&c=hello');
        var path = currentPath('pathname');
        assert.equal(path, '/path');
      });
    });
  });

  describe('getSwitch', function() {
    describe('default', function() {
      beforeEach(function() {
        this.props = {
          basePath: '',
          children: [
            <div key="1" path="/">Home</div>,
            <div key="2" path="/another">Another</div>,
            <div key="3" path="/wildCardPath/.*">Wild</div>,
            <div key="4" path="/path/.+/more">Dynamic</div>,
            <div key="5" path="/duplicate">Dup 1</div>,
            <div key="6" path="/duplicate">Dup 2</div>,
            <div key="7" path={['/arr1', '/arr2', '/arr2/more']}>Array</div>
          ]
        };
      });

      it('gets component with matching path', function() {
        var swtch = getSwitch('/another', this.props);
        assert.equal(swtch.props.children, 'Another');
      });

      it('handles trailing /', function() {
        var swtch = getSwitch('/another/', this.props);
        assert.equal(swtch.props.children, 'Another');
      });

      it('returns null if there is no matching switch', function() {
        var swtch = getSwitch('/notHere', this.props);
        assert.isNull(swtch);
      });

      it('gets first match if duplicate paths', function() {
        var swtch = getSwitch('/duplicate', this.props);
        assert.equal(swtch.props.children, 'Dup 1');
      });

      it('handles paths with wild cards', function() {
        var swtch = getSwitch('/wildCardPath/something', this.props);
        var swtch2 = getSwitch('/wildCardPath/something/more', this.props);
        assert.equal(swtch.props.children, 'Wild');
        assert.equal(swtch2.props.children, 'Wild');
      });

      it('handles paths with dynamic segments', function() {
        var swtch = getSwitch('/path/abc123/more', this.props);
        var swtch2 = getSwitch('/path/somethingelse/more', this.props);
        assert.equal(swtch.props.children, 'Dynamic');
        assert.equal(swtch2.props.children, 'Dynamic');
      });

      it('handles array of paths', function() {
        var swtch = getSwitch('/arr1', this.props);
        var swtch2 = getSwitch('/arr2/more', this.props);
        assert.equal(swtch.props.children, 'Array');
        assert.equal(swtch2.props.children, 'Array');
      });
    });

    describe('with basepath set', function() {
      beforeEach(function() {
        this.props = {
          basePath: '/base',
          children: [
            <div key="1" path="/">Home</div>,
            <div key="2" path="/another">Another</div>,
            <div key="3" path="/duplicate">Dup 1</div>,
            <div key="4" path="/duplicate">Dup 2</div>
          ]
        };
      });

      it('gets component with matching path', function() {
        var swtch = getSwitch('/base/another', this.props);
        assert.equal(swtch.props.children, 'Another');
      });
    });

    describe('with no children', function() {
      beforeEach(function() {
        this.props = {
          basePath: '/base',
          children: null
        };
      });

      it('renders nothing', function() {
        var swtch = getSwitch('/base/another', this.props);
        assert.equal(swtch, null);
      });
    });
  });

  describe('createRegexFromPaths', function() {
    it('joins paths and creates a regex', function() {
      var paths = ['/one/b', '/two/a/b', '/three'];
      var regex = createRegexFromPaths(paths);
      assert.equal(`${regex}`, '/^(\\/one\\/b|\\/two\\/a\\/b|\\/three)$/');
      assert(regex instanceof RegExp);
    });
  });

  describe('formatPathRegex', function() {
    it('combines base path and path', function() {
      var formattedPath = formatPathRegex('/base', '/path/test');
      assert.equal(formattedPath, '/base/path/test/?');
    });

    it('handles path with trailing slash', function() {
      var formattedPath = formatPathRegex('/base', '/path/test/');
      assert.equal(formattedPath, '/base/path/test/?');
    });

    it('replaces dynamic segments', function() {
      var formattedPath = formatPathRegex('/base', '/path/:dyn1/test/:dyn2');
      assert.equal(formattedPath, '/base/path/([^/]+)/test/([^/]+)/?');
    });
  });

  describe('replaceDynamicSegments', function() {
    it('replaces dynamic expressions with regex string', function() {
      var path = '/:test/more/:another/:last/urlStuffs';
      var newPath = replaceDynamicSegments(path);
      assert.deepEqual(newPath, '/([^/]+)/more/([^/]+)/([^/]+)/urlStuffs');
    });

    it('does nothing if no dynamic segments', function() {
      var path = '/test/more/another/last/urlStuffs';
      var newPath = replaceDynamicSegments(path);
      assert.deepEqual(newPath, path);
    });
  });

  describe('getDynamicSegmentNames', function() {
    it('returns an array with string names of dynamic segments', function() {
      var path = '/:test/more/:another/:last/urlStuffs';
      var dynamicSegments = getDynamicSegmentNames(path);
      assert.deepEqual(dynamicSegments, ['test', 'another', 'last']);
    });

    it('returns an empty array if no dynamic segments', function() {
      var path = '/test/more/another/last/urlStuffs';
      var dynamicSegments = getDynamicSegmentNames(path);
      assert.deepEqual(dynamicSegments, []);
    });
  });

  describe('getDynamicSegments', function() {
    it('returns an empty object if no dynamic segments', function() {
      var path = '/base/helloWorld/more/something-123/data/urlStuffs';
      var basePath = '/base';
      var swtch = <span path='/base/helloWorld/more/something-123/data/urlStuffs' />;
      var dynamicValues = getDynamicSegments(path, basePath, swtch);
      assert.deepEqual(dynamicValues, {});
    });

    it('returns an object of dynamic segments {name: value, ...}', function() {
      var path = '/base/helloWorld/more/something-123/data/urlStuffs';
      var basePath = '/base';
      var swtch = <span path="/:test/more/:another/:last/urlStuffs" />;
      var dynamicValues = getDynamicSegments(path, basePath, swtch);
      assert.deepEqual(dynamicValues, {
        test: 'helloWorld',
        another: 'something-123',
        last: 'data'
      });
    });

    it('handles dynamic segments in the base path', function() {
      var path = '/stuff/helloWorld/more/';
      var basePath = '/:base';
      var swtch = <span path="/helloWorld/:data" />;
      var dynamicValues = getDynamicSegments(path, basePath, swtch);
      assert.deepEqual(dynamicValues, {
        base: 'stuff',
        data: 'more'
      });
    });

    it('handles switches with an array of paths', function() {
      var path = '/base/helloWorld/more/something-123/data/urlStuffs';
      var basePath = '/base';
      var swtch = (
        <span path={['/:test/more', '/:test/more/:another/:last/urlStuffs', '/another']} />
      );
      var dynamicValues = getDynamicSegments(path, basePath, swtch);
      assert.deepEqual(dynamicValues, {
        test: 'helloWorld',
        another: 'something-123',
        last: 'data'
      });
    });
  });
});
