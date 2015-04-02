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
    this.getHandler = this.getHandler.bind(this);

    // set initial state
    this.state = {
      visibleComponent: NullComponent
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
    return decodeURI(window.location.href.split('#')[1] || '');
  }

  getHistoryLocation() {
    return decodeURI(window.location.pathname + window.location.search);
  }

  getHandler(path) {
    return this.props.children.reduce((prev, curr) => {
      return (curr.props.path === path && curr.props.handler) || prev;
    }, false);
  }

  handleRouteChange(e) {
    var newRoute = this.getLocation();
    this.setState({
      visibleComponent: this.getHandler(newRoute) || NullComponent
    });
  }

  render() {
    return React.createElement(this.state.visibleComponent, null);
  }
}

Switcher.propTypes = {
  children: React.PropTypes.arrayOf(React.PropTypes.element),
  pushState: React.PropTypes.bool
};

Switcher.defaultProps = {
  pushState: false
};
