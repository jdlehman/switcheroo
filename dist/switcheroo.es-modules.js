import React, { Component, PropTypes } from 'react';

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
  return dynamicSegementNames.map(function (name) {
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
  var children = _ref.children;
  var basePath = _ref.basePath;

  var consistentPath = removeTrailingSlash(path);
  var switches = [].concat(children || []);
  return switches.filter(function (child) {
    var childPaths = [].concat(child.props.path).map(function (childPath) {
      return formatPathRegex(basePath, childPath);
    });
    var regex = createRegexFromPaths(childPaths);
    return regex.test(consistentPath);
  })[0] || null;
}

function getDynamicSegments(path, basePath, swtch) {
  var dynamicValues = {};
  var consistentPath = removeTrailingSlash(path);
  if (swtch) {
    [].concat(swtch.props.path).forEach(function (childPath) {
      var dynamicSegments = getDynamicSegmentNames(basePath + childPath);
      var regexStr = formatPathRegex(basePath, childPath);
      var matches = consistentPath.match(new RegExp('^' + regexStr + '$'));
      if (matches) {
        matches.shift();
        dynamicSegments.forEach(function (segment, index) {
          dynamicValues[segment] = matches[index];
        });
      }
    });
  }
  return dynamicValues;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
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

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Switcher = function (_Component) {
  inherits(Switcher, _Component);

  function Switcher(props) {
    classCallCheck(this, Switcher);

    var _this = possibleConstructorReturn(this, Object.getPrototypeOf(Switcher).call(this, props));

    _initialiseProps.call(_this);

    var currPath = currentPath(props.location);
    var switchElement = getSwitch(currPath, props);
    var dynamicValues = getDynamicSegments(currPath, props.basePath, switchElement);
    _this.state = {
      visibleSwitch: switchElement,
      dynamicValues: dynamicValues
    };
    return _this;
  }

  createClass(Switcher, [{
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
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.handleSwitchChange(nextProps);
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return !nextProps.preventUpdate();
    }
  }, {
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
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _ref = this.state.visibleSwitch || {};

      var props = _ref.props;

      var visibleSwitch = this.state.visibleSwitch && React__default.cloneElement(this.state.visibleSwitch, _extends({}, props, this.props.mapDynamicSegments(this.state.dynamicValues)));

      if (this.props.renderSwitch) {
        return this.props.renderSwitch(visibleSwitch, this.state.dynamicValues);
      }

      if (this.props.wrapper) {
        var _ret = function () {
          var passedProps = _extends({}, _this2.props);
          Object.keys(Switcher.propTypes).forEach(function (k) {
            return delete passedProps[k];
          });
          return {
            v: React__default.createElement(_this2.props.wrapper, passedProps, visibleSwitch)
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      } else {
        return visibleSwitch;
      }
    }
  }]);
  return Switcher;
}(React.Component);

Switcher.displayName = 'Switcher';
Switcher.propTypes = {
  children: React.PropTypes.oneOfType([React.PropTypes.arrayOf(React.PropTypes.node), React.PropTypes.node]),
  pushState: React.PropTypes.bool,
  hashChange: React.PropTypes.bool,
  load: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  wrapper: React.PropTypes.any,
  location: React.PropTypes.string,
  basePath: React.PropTypes.string,
  preventUpdate: React.PropTypes.func,
  mapDynamicSegments: React.PropTypes.func,
  renderSwitch: React.PropTypes.func
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
  var _this3 = this;

  this.handleSwitchChange = function (props) {
    var currPath = currentPath(props.location);
    var visibleSwitch = getSwitch(currPath, props);
    var dynamicValues = getDynamicSegments(currPath, props.basePath, visibleSwitch);

    if (typeof props.onChange === 'function') {
      props.onChange(!!visibleSwitch, currPath, dynamicValues);
    }

    _this3.setState({ visibleSwitch: visibleSwitch, dynamicValues: dynamicValues });
  };

  this.handleRouteChange = function (ev) {
    _this3.handleSwitchChange(_this3.props);
  };
};

export default Switcher;