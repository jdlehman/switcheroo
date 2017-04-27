'use strict';

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

var React = require('react');
var React__default = _interopDefault(React);

function createCommonjsModule(fn, module) {
  return (module = { exports: {} }), fn(module, module.exports), module.exports;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function() {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function() {
  return this;
};
emptyFunction.thatReturnsArgument = function(arg) {
  return arg;
};

var emptyFunction_1 = emptyFunction;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
          'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() {
          return args[argIndex++];
        })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

var invariant_1 = invariant;

var factoryWithThrowingShims = function() {
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  function shim() {
    invariant_1(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
        'Use PropTypes.checkPropTypes() to call them. ' +
        'Read more at http://fb.me/use-check-prop-types'
    );
  }
  shim.isRequired = shim;
  function getShim() {
    return shim;
  }
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction_1;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var index = createCommonjsModule(function(module) {
  /**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

  {
    // By explicitly using `prop-types` you are opting into new production behavior.
    // http://fb.me/prop-types-in-prod
    module.exports = factoryWithThrowingShims();
  }
});

function currentPath(location) {
  var path = decodeURI(window.location[location].slice(1).split('?')[0]);
  if (path.charAt(0) !== '/') {
    return '/' + path;
  } else {
    return path;
  }
}

function removeTrailingSlash(path) {
  if (path === '/') {
    return path;
  } else {
    return path.slice(-1) !== '/' ? path : path.slice(0, -1);
  }
}

function replaceDynamicSegments(path) {
  return path.replace(/\/:[^\/]+/g, '/([^/]+)');
}

function getDynamicSegmentNames(path) {
  var dynamicSegementNames = path.match(/:[^\/]+/g) || [];
  return dynamicSegementNames.map(function(name) {
    return name.substr(1);
  });
}

function formatPathRegex(basePath, path) {
  return replaceDynamicSegments(removeTrailingSlash(basePath + path) + '/?');
}

function createRegexFromPaths(paths) {
  return new RegExp('^(' + paths.join('|') + ')$');
}

function getSwitch(path, _ref) {
  var children = _ref.children, basePath = _ref.basePath;

  var consistentPath = removeTrailingSlash(path);
  var switches = React.Children.toArray(children);
  return (
    switches.filter(function(child) {
      var childPaths = [].concat(child.props.path).map(function(childPath) {
        return formatPathRegex(basePath, childPath);
      });
      var regex = createRegexFromPaths(childPaths);
      return regex.test(consistentPath);
    })[0] || null
  );
}

function getActivePath(currentPath, basePath, currentSwitch) {
  if (!currentSwitch) {
    return null;
  }

  var consistentPath = removeTrailingSlash(currentPath);
  var paths = [].concat(currentSwitch.props.path);
  return (
    paths.filter(function(path) {
      var formattedPath = formatPathRegex(basePath, path);
      var regex = new RegExp('^' + formattedPath + '$');
      return regex.test(consistentPath);
    })[0] || null
  );
}

function getDynamicSegments(path, basePath, swtch) {
  var dynamicValues = {};
  var consistentPath = removeTrailingSlash(path);
  if (swtch) {
    [].concat(swtch.props.path).forEach(function(childPath) {
      var dynamicSegments = getDynamicSegmentNames(basePath + childPath);
      var regexStr = formatPathRegex(basePath, childPath);
      var matches = consistentPath.match(new RegExp('^' + regexStr + '$'));
      if (matches) {
        matches.shift();
        dynamicSegments.forEach(function(segment, index) {
          dynamicValues[segment] = matches[index];
        });
      }
    });
  }
  return dynamicValues;
}

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

var Switcher = (function(_Component) {
  _inherits(Switcher, _Component);

  function Switcher(props) {
    _classCallCheck(this, Switcher);

    var _this = _possibleConstructorReturn(
      this,
      (Switcher.__proto__ || Object.getPrototypeOf(Switcher)).call(this, props)
    );

    _initialiseProps.call(_this);

    var currPath = currentPath(props.location);
    var visibleSwitch = getSwitch(currPath, props);
    var activePath = getActivePath(currPath, props.basePath, visibleSwitch);
    var dynamicValues = getDynamicSegments(
      currPath,
      props.basePath,
      visibleSwitch
    );
    _this.state = {
      visibleSwitch: visibleSwitch,
      dynamicValues: dynamicValues,
      activePath: activePath
    };
    return _this;
  }

  _createClass(Switcher, [
    {
      key: 'componentDidMount',
      value: function componentDidMount() {
        if (this.props.load) {
          window.addEventListener('load', this.handleRouteChange);
        }
        if (this.props.pushState) {
          window.addEventListener('popstate', this.handleRouteChange);
        }
        if (this.props.hashChange) {
          window.addEventListener('hashchange', this.handleRouteChange);
        }
      }
    },
    {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        this.handleSwitchChange(nextProps);
      }
    },
    {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        return !nextProps.preventUpdate();
      }
    },
    {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (this.props.load) {
          window.removeEventListener('load', this.handleRouteChange);
        }
        if (this.props.pushState) {
          window.removeEventListener('popstate', this.handleRouteChange);
        }
        if (this.props.hashChange) {
          window.removeEventListener('hashchange', this.handleRouteChange);
        }
      }
    },
    {
      key: 'render',
      value: function render() {
        var _ref = this.state.visibleSwitch || {}, props = _ref.props;

        var visibleSwitch =
          this.state.visibleSwitch &&
          React__default.cloneElement(
            this.state.visibleSwitch,
            _extends(
              {},
              props,
              this.props.mapDynamicSegments(this.state.dynamicValues),
              {
                activePath: this.state.activePath
              }
            )
          );

        if (this.props.renderSwitch) {
          return this.props.renderSwitch(
            visibleSwitch,
            this.state.dynamicValues,
            this.state.activePath
          );
        }

        if (this.props.wrapper) {
          var passedProps = _extends({}, this.props);
          Object.keys(Switcher.propTypes).forEach(function(k) {
            return delete passedProps[k];
          });
          return React__default.createElement(
            this.props.wrapper,
            passedProps,
            visibleSwitch
          );
        } else {
          return visibleSwitch;
        }
      }
    }
  ]);

  return Switcher;
})(React.Component);

Switcher.displayName = 'Switcher';
Switcher.propTypes = {
  children: index.oneOfType([index.arrayOf(index.node), index.node]),
  pushState: index.bool,
  hashChange: index.bool,
  load: index.bool,
  onChange: index.func,
  wrapper: index.any,
  location: index.string,
  basePath: index.string,
  preventUpdate: index.func,
  mapDynamicSegments: index.func,
  renderSwitch: index.func
};
Switcher.defaultProps = {
  pushState: false,
  hashChange: true,
  load: true,
  location: 'hash',
  basePath: '',
  preventUpdate: function preventUpdate() {
    return false;
  },
  mapDynamicSegments: function mapDynamicSegments(values) {
    return values;
  }
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.handleSwitchChange = function(props) {
    var currPath = currentPath(props.location);
    var visibleSwitch = getSwitch(currPath, props);
    var activePath = getActivePath(currPath, props.basePath, visibleSwitch);
    var dynamicValues = getDynamicSegments(
      currPath,
      props.basePath,
      visibleSwitch
    );

    if (typeof props.onChange === 'function') {
      props.onChange(!!visibleSwitch, currPath, dynamicValues, activePath);
    }

    _this2.setState({
      visibleSwitch: visibleSwitch,
      dynamicValues: dynamicValues,
      activePath: activePath
    });
  };

  this.handleRouteChange = function(ev) {
    _this2.handleSwitchChange(_this2.props);
  };
};

module.exports = Switcher;
