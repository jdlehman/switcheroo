import React, {Component} from 'react';
import {ensureTrailingSlash} from 'helpers';
import window from 'window';

export default class Switcher extends Component {
  static displayName = 'Switcher';

  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.element),
      React.PropTypes.element
    ]).isRequired,
    pushState: React.PropTypes.bool,
    hashChange: React.PropTypes.bool,
    load: React.PropTypes.bool,
    defaultHandler: React.PropTypes.func,
    defaultHandlerProps: React.PropTypes.object,
    onChange: React.PropTypes.func,
    wrapper: React.PropTypes.any,
    location: React.PropTypes.string,
    basePath: React.PropTypes.string
  };

  static defaultProps = {
    pushState: false,
    hashChange: true,
    load: true,
    location: 'hash',
    basePath: ''
  };

  constructor(props) {
    super(props);
    this.defaultSwitch = props.defaultHandler ? React.createElement(props.defaultHandler, props.defaultHandlerProps) : null;

    var currentPath = this.getLocation();
    var switchElement = this.getSwitch(currentPath);
    this.state = {
      visibleSwitch: switchElement
    };
  }

  componentDidMount() {
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

  componentWillReceiveProps(nextProps) {
    var currentPath = this.getLocation();
    var switchElement = this.getSwitch(currentPath);

    this.setState({
      visibleSwitch: switchElement
    });
  }

  componentWillUnmount() {
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

  getLocation = () => {
    var location = decodeURI(window.location[this.props.location].slice(1).split('?')[0]);
    if (location.charAt(0) !== '/') {
      return `/${location}`;
    } else {
      return location;
    }
  }

  getSwitch = (path) => {
    var children = [].concat(this.props.children);
    var consistentPath = ensureTrailingSlash(path);
    return children.filter(child => {
      var childPaths = [].concat(child.props.path).map(childPath => {
        return ensureTrailingSlash(this.props.basePath + childPath);
      });
      var regex = new RegExp(`^${childPaths.join('|')}$`);
      return consistentPath.match(regex);
    })[0] || null;
  }

  handleRouteChange = (ev) => {
    var currentPath = this.getLocation();
    var switchElement = this.getSwitch(currentPath);

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(!!switchElement, currentPath);
    }

    this.setState({
      visibleSwitch: switchElement
    });
  }

  render() {
    if (this.props.wrapper) {
      return React.createElement(
        this.props.wrapper,
        this.props,
        this.state.visibleSwitch || this.defaultSwitch
      );
    } else {
      return this.state.visibleSwitch || this.defaultSwitch;
    }
  }
}
