import React from 'react';
import {
  removeTrailingSlash,
  currentPath,
  createRegexFromPaths,
  formatPathRegex,
  getSwitch,
  replaceDynamicSegments,
  getDynamicSegmentNames,
  getDynamicSegments,
  getActivePath,
  generateGuid
} from '../src/helpers';

describe('helpers', () => {
  describe('removeTrailingSlash', () => {
    it('removes trailing slash to path with it', () => {
      const path = '/test/something/more';
      const newPath = removeTrailingSlash(`${path}/`);
      expect(newPath).toEqual(path);
    });

    it('returns unmodified path if it does not have a trailing slash', () => {
      const path = '/test/something/more';
      const newPath = removeTrailingSlash(path);
      expect(newPath).toEqual(path);
    });

    it('returns unmodified path if path is /', () => {
      const path = '/';
      const newPath = removeTrailingSlash(path);
      expect(newPath).toEqual(path);
    });
  });

  describe('currentPath', () => {
    describe('using location.hash', () => {
      it('gets hash by default', () => {
        window.location.hash = '/path';
        const path = currentPath('hash');
        expect(path).toEqual('/path');
      });

      it('ensures that path is prepended with a slash', () => {
        window.location.hash = 'path';
        const path = currentPath('hash');
        expect(path).toEqual('/path');
      });

      it('does not include query parameters', () => {
        window.location.hash = '/path?a=2&b=3&c=hello';
        const path = currentPath('hash');
        expect(path).toEqual('/path');
      });
    });

    describe('using location.pathname', () => {
      it('gets hash by default', () => {
        window.history.pushState({}, '', '/path');
        const path = currentPath('pathname');
        expect(path).toEqual('/path');
      });

      it('ensures that path is prepended with a slash', () => {
        window.history.pushState({}, '', 'path');
        const path = currentPath('pathname');
        expect(path).toEqual('/path');
      });

      it('does not include query parameters', () => {
        window.history.pushState({}, '', '/path?a=2&b=3&c=hello');
        const path = currentPath('pathname');
        expect(path).toEqual('/path');
      });
    });
  });

  describe('getSwitch', () => {
    describe('default', () => {
      let props;
      beforeEach(() => {
        props = {
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

      it('gets component with matching path', () => {
        const swtch = getSwitch('/another', props);
        expect(swtch.props.children).toEqual('Another');
      });

      it('handles trailing /', () => {
        const swtch = getSwitch('/another/', props);
        expect(swtch.props.children).toEqual('Another');
      });

      it('returns null if there is no matching switch', () => {
        const swtch = getSwitch('/notHere', props);
        expect(swtch).toBeNull();
      });

      it('gets first match if duplicate paths', () => {
        const swtch = getSwitch('/duplicate', props);
        expect(swtch.props.children).toEqual('Dup 1');
      });

      it('handles paths with wild cards', () => {
        const swtch = getSwitch('/wildCardPath/something', props);
        const swtch2 = getSwitch('/wildCardPath/something/more', props);
        expect(swtch.props.children).toEqual('Wild');
        expect(swtch2.props.children).toEqual('Wild');
      });

      it('handles paths with dynamic segments', () => {
        const swtch = getSwitch('/path/abc123/more', props);
        const swtch2 = getSwitch('/path/somethingelse/more', props);
        expect(swtch.props.children).toEqual('Dynamic');
        expect(swtch2.props.children).toEqual('Dynamic');
      });

      it('handles array of paths', () => {
        const swtch = getSwitch('/arr1', props);
        const swtch2 = getSwitch('/arr2/more', props);
        expect(swtch.props.children).toEqual('Array');
        expect(swtch2.props.children).toEqual('Array');
      });
    });

    describe('with basepath set', () => {
      let props;
      beforeEach(() => {
        props = {
          basePath: '/base',
          children: [
            <div key="1" path="/">Home</div>,
            <div key="2" path="/another">Another</div>,
            <div key="3" path="/duplicate">Dup 1</div>,
            <div key="4" path="/duplicate">Dup 2</div>
          ]
        };
      });

      it('gets component with matching path', () => {
        const swtch = getSwitch('/base/another', props);
        expect(swtch.props.children).toEqual('Another');
      });
    });

    describe('with no children', () => {
      let props;
      beforeEach(() => {
        props = {
          basePath: '/base',
          children: null
        };
      });

      it('renders nothing', () => {
        const swtch = getSwitch('/base/another', props);
        expect(swtch).toEqual(null);
      });
    });
  });

  describe('createRegexFromPaths', () => {
    it('joins paths and creates a regex', () => {
      const paths = ['/one/b', '/two/a/b', '/three'];
      const regex = createRegexFromPaths(paths);
      expect(`${regex}`).toEqual('/^(\\/one\\/b|\\/two\\/a\\/b|\\/three)$/');
      expect(regex instanceof RegExp);
    });
  });

  describe('formatPathRegex', () => {
    it('combines base path and path', () => {
      const formattedPath = formatPathRegex('/base', '/path/test');
      expect(formattedPath).toEqual('/base/path/test/?');
    });

    it('handles path with trailing slash', () => {
      const formattedPath = formatPathRegex('/base', '/path/test/');
      expect(formattedPath).toEqual('/base/path/test/?');
    });

    it('replaces dynamic segments', () => {
      const formattedPath = formatPathRegex('/base', '/path/:dyn1/test/:dyn2');
      expect(formattedPath).toEqual('/base/path/([^/]+)/test/([^/]+)/?');
    });
  });

  describe('replaceDynamicSegments', () => {
    it('replaces dynamic expressions with regex string', () => {
      const path = '/:test/more/:another/:last/urlStuffs';
      const newPath = replaceDynamicSegments(path);
      expect(newPath).toEqual('/([^/]+)/more/([^/]+)/([^/]+)/urlStuffs');
    });

    it('does nothing if no dynamic segments', () => {
      const path = '/test/more/another/last/urlStuffs';
      const newPath = replaceDynamicSegments(path);
      expect(newPath).toEqual(path);
    });
  });

  describe('getDynamicSegmentNames', () => {
    it('returns an array with string names of dynamic segments', () => {
      const path = '/:test/more/:another/:last/urlStuffs';
      const dynamicSegments = getDynamicSegmentNames(path);
      expect(dynamicSegments).toEqual(['test', 'another', 'last']);
    });

    it('returns an empty array if no dynamic segments', () => {
      const path = '/test/more/another/last/urlStuffs';
      const dynamicSegments = getDynamicSegmentNames(path);
      expect(dynamicSegments).toEqual([]);
    });
  });

  describe('getDynamicSegments', () => {
    it('returns an empty object if no dynamic segments', () => {
      const path = '/base/helloWorld/more/something-123/data/urlStuffs';
      const basePath = '/base';
      const swtch = (
        <span path="/base/helloWorld/more/something-123/data/urlStuffs" />
      );
      const dynamicValues = getDynamicSegments(path, basePath, swtch);
      expect(dynamicValues).toEqual({});
    });

    it('returns an object of dynamic segments {name: value, ...}', () => {
      const path = '/base/helloWorld/more/something-123/data/urlStuffs';
      const basePath = '/base';
      const swtch = <span path="/:test/more/:another/:last/urlStuffs" />;
      const dynamicValues = getDynamicSegments(path, basePath, swtch);
      expect(dynamicValues).toEqual({
        test: 'helloWorld',
        another: 'something-123',
        last: 'data'
      });
    });

    it('handles dynamic segments in the base path', () => {
      const path = '/stuff/helloWorld/more/';
      const basePath = '/:base';
      const swtch = <span path="/helloWorld/:data" />;
      const dynamicValues = getDynamicSegments(path, basePath, swtch);
      expect(dynamicValues).toEqual({
        base: 'stuff',
        data: 'more'
      });
    });

    it('handles switches with an array of paths', () => {
      const path = '/base/helloWorld/more/something-123/data/urlStuffs';
      const basePath = '/base';
      const swtch = (
        <span
          path={[
            '/:test/more',
            '/:test/more/:another/:last/urlStuffs',
            '/another'
          ]}
        />
      );
      const dynamicValues = getDynamicSegments(path, basePath, swtch);
      expect(dynamicValues).toEqual({
        test: 'helloWorld',
        another: 'something-123',
        last: 'data'
      });
    });
  });

  describe('getActivePath', () => {
    it('returns null if there is no match/currentSwitch', () => {
      const activePath = getActivePath('/something', '/base', null);
      expect(activePath).toBeNull();
    });

    it('returns the active path from the current switch', () => {
      const currentSwitch = {
        props: {
          path: ['/home', '/abc/something/:id', '/abc/something']
        }
      };
      const activePath = getActivePath(
        '/base/abc/something/1233',
        '/base',
        currentSwitch
      );
      expect(activePath).toEqual('/abc/something/:id');
    });
  });

  describe('generateGuid', () => {
    it('generates a unique guid', () => {
      expect(generateGuid()).not.toEqual(generateGuid());
    });
  });
});
