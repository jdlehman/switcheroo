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

    this.defaultComponent = React.createElement(NullComponent, null);
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
    return decodeURI(window.location.href.split('#')[1] || '');
  }

  getHistoryLocation() {
    return decodeURI(window.location.pathname + window.location.search);
  }

  getSwitch(path) {
    return this.props.children.filter((child) => {
      return child.props.path === path;
    })[0];
  }

  handleRouteChange(e) {
    var newRoute = this.getLocation();
    this.setState({
      visibleComponent: this.getSwitch(newRoute)
    });
  }

  render() {
    return this.state.visibleComponent || this.defaultComponent;
  }
}

Switcher.displayName = 'Switcher';

Switcher.propTypes = {
  children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired,
  pushState: React.PropTypes.bool
};

Switcher.defaultProps = {
  pushState: false
};
