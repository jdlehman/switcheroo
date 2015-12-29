import React, {Component, PropTypes} from 'react';
import {removeTrailingSlash} from './helpers';

export default class Switcher extends Component {
  static displayName = 'Switcher';

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element
    ]).isRequired,
    pushState: PropTypes.bool,
    hashChange: PropTypes.bool,
    load: PropTypes.bool,
    onChange: PropTypes.func,
    wrapper: PropTypes.any,
    location: PropTypes.string,
    basePath: PropTypes.string
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
    var consistentPath = removeTrailingSlash(path);
    return children.filter(child => {
      var childPaths = [].concat(child.props.path).map(childPath => {
        return `${removeTrailingSlash(this.props.basePath + childPath)}/?`;
      });
      var regex = new RegExp(`^${childPaths.join('|')}$`);
      return regex.test(consistentPath);
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
        this.state.visibleSwitch
      );
    } else {
      return this.state.visibleSwitch;
    }
  }
}
