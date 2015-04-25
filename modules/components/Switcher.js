import React, {Component} from 'react';
import window from 'window';

export default class Switcher extends Component {
  constructor(props) {
    super(props);
    // bind methods
    this.getLocation = this.getLocation.bind(this);
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.getSwitch = this.getSwitch.bind(this);

    this.defaultSwitch = this.props.defaultHandler ? React.createElement(this.props.defaultHandler, this.props.defaultHandlerProps) : null;
    // set initial state
    this.state = {
      visibleSwitch: null
    };
  }

  componentDidMount() {
    if(this.props.load) {
      window.addEventListener('load', this.handleRouteChange);
    }
    if(this.props.pushState) {
      window.addEventListener('popstate', this.handleRouteChange);
    }
    if(this.props.hashChange) {
      window.addEventListener('hashchange', this.handleRouteChange);
    }
  }

  componentWillUnmount() {
    if(this.props.load) {
      window.removeEventListener('load', this.handleRouteChange);
    }
    if(this.props.pushState) {
      window.removeEventListener('popstate', this.handleRouteChange);
    }
    if(this.props.hashChange) {
      window.removeEventListener('hashchange', this.handleRouteChange);
    }
  }

  getLocation() {
    var location = decodeURI(window.location[this.props.location].slice(1).split('?')[0]);
    if(location.charAt(0) !== '/') {
      return `/${location}`;
    }
    else {
      return location;
    }
  }

  getSwitch(path) {
    var children = [].concat(this.props.children);
    return children.filter((child) => {
      return `${this.props.basePath}${child.props.path}` === path;
    })[0];
  }

  handleRouteChange(e) {
    var newRoute = this.getLocation(),
        switchElement = this.getSwitch(newRoute);
    if(typeof this.props.onChange === 'function') {
      this.props.onChange(!!switchElement, newRoute);
    }

    this.setState({
      visibleSwitch: switchElement
    });
  }

  render() {
    if(this.props.wrapper) {
      return React.createElement(
        this.props.wrapper,
        this.props,
        this.state.visibleSwitch || this.defaultSwitch
      );
    }
    else {
      return this.state.visibleSwitch || this.defaultSwitch;
    }
  }
}

Switcher.displayName = 'Switcher';

Switcher.propTypes = {
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
  baseURL: React.PropTypes.string
};

Switcher.defaultProps = {
  pushState: false,
  hashChange: true,
  load: true,
  location: 'hash',
  basePath: ''
};
