import React, { Component, PropTypes, Children } from 'react';

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
  var children = _ref.children,
      basePath = _ref.basePath;

  var consistentPath = removeTrailingSlash(path);
  var switches = React.Children.toArray(children);
  return switches.filter(function (child) {
    var childPaths = [].concat(child.props.path).map(function (childPath) {
      return formatPathRegex(basePath, childPath);
    });
    var regex = createRegexFromPaths(childPaths);
    return regex.test(consistentPath);
  })[0] || null;
}

function getActivePath(currentPath, basePath, currentSwitch) {
  if (!currentSwitch) {
    return null;
  }

  var consistentPath = removeTrailingSlash(currentPath);
  var paths = [].concat(currentSwitch.props.path);
  return paths.filter(function (path) {
    var formattedPath = formatPathRegex(basePath, path);
    var regex = new RegExp('^' + formattedPath + '$');
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

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

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

    var _this = possibleConstructorReturn(this, (Switcher.__proto__ || Object.getPrototypeOf(Switcher)).call(this, props));

    _initialiseProps.call(_this);

    var currPath = currentPath(props.location);
    var visibleSwitch = getSwitch(currPath, props);
    var activePath = getActivePath(currPath, props.basePath, visibleSwitch);
    var dynamicValues = getDynamicSegments(currPath, props.basePath, visibleSwitch);
    _this.state = {
      visibleSwitch: visibleSwitch,
      dynamicValues: dynamicValues,
      activePath: activePath
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
      var _ref = this.state.visibleSwitch || {},
          props = _ref.props;

      var visibleSwitch = this.state.visibleSwitch && React__default.cloneElement(this.state.visibleSwitch, _extends({}, props, this.props.mapDynamicSegments(this.state.dynamicValues), { activePath: this.state.activePath }));

      if (this.props.renderSwitch) {
        return this.props.renderSwitch(visibleSwitch, this.state.dynamicValues, this.state.activePath);
      }

      if (this.props.wrapper) {
        var passedProps = _extends({}, this.props);
        Object.keys(Switcher.propTypes).forEach(function (k) {
          return delete passedProps[k];
        });
        return React__default.createElement(this.props.wrapper, passedProps, visibleSwitch);
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
  var _this2 = this;

  this.handleSwitchChange = function (props) {
    var currPath = currentPath(props.location);
    var visibleSwitch = getSwitch(currPath, props);
    var activePath = getActivePath(currPath, props.basePath, visibleSwitch);
    var dynamicValues = getDynamicSegments(currPath, props.basePath, visibleSwitch);

    if (typeof props.onChange === 'function') {
      props.onChange(!!visibleSwitch, currPath, dynamicValues, activePath);
    }

    _this2.setState({ visibleSwitch: visibleSwitch, dynamicValues: dynamicValues, activePath: activePath });
  };

  this.handleRouteChange = function (ev) {
    _this2.handleSwitchChange(_this2.props);
  };
};

export default Switcher;