import React, {Component} from 'react';
import NullComponent from './NullComponent';

export default class Switcher extends Component {
  constructor(props) {
    super(props);
    // bind methods
    this.getLocation = this.getLocation.bind(this);
    this.getHashLocation = this.getHashLocation.bind(this);
    this.getHistoryLocation = this.getHistoryLocation.bind(this);
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.getSwitch = this.getSwitch.bind(this);

    this.defaultComponent = React.createElement(this.props.defaultHandler || NullComponent, this.props.defaultHandlerProps);
    // set initial state
    this.state = {
      visibleComponent: null
    };
  }

  componentDidMount() {
    window.addEventListener('load', this.handleRouteChange);
    if(this.props.pushState) {
      window.addEventListener('popstate', this.handleRouteChange);
    }
    else {
      window.addEventListener('hashchange', this.handleRouteChange);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.handleRouteChange);
    if(this.props.pushState) {
      window.removeEventListener('popstate', this.handleRouteChange);
    }
    else {
      window.removeEventListener('hashchange', this.handleRouteChange);
    }
  }

  getLocation() {
    var location = this.props.pushState ? this.getHistoryLocation() : this.getHashLocation();
    if(location.charAt(0) !== '/') {
      return `/${location}`;
    }
    else {
      return location;
    }
  }

  getHashLocation() {
    return decodeURI(window.location.hash.slice(1).split('?')[0]);
  }

  getHistoryLocation() {
    return decodeURI(window.location.pathname);
  }

  getSwitch(path) {
    var children = [].concat(this.props.children);
    return children.filter((child) => {
      return child.props.path === path;
    })[0];
  }

  handleRouteChange(e) {
    var newRoute = this.getLocation(),
        switchElement = this.getSwitch(newRoute);
    if(typeof this.props.onChange === 'function') {
      this.props.onChange(!!switchElement, newRoute);
    }

    this.setState({
      visibleComponent: switchElement
    });
  }

  render() {
    return this.state.visibleComponent || this.defaultComponent;
  }
}

Switcher.displayName = 'Switcher';

Switcher.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.element),
    React.PropTypes.element
  ]).isRequired,
  pushState: React.PropTypes.bool,
  defaultHandler: React.PropTypes.func,
  defaultHandlerProps: React.PropTypes.object,
  onChange: React.PropTypes.func
};

Switcher.defaultProps = {
  pushState: false
};
