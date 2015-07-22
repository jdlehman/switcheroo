import React, {Component} from 'react';
import Recognizer from 'route-recognizer';
import window from 'window';

export default class Switcher extends Component {
  constructor(props) {
    super(props);
    // bind methods
    this.getLocation = this.getLocation.bind(this);
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.getSwitch = this.getSwitch.bind(this);
    this.initializeRecognizer = this.initializeRecognizer.bind(this);

    this.defaultSwitch = props.defaultHandler ? React.createElement(props.defaultHandler, props.defaultHandlerProps) : null;
    this.initializeRecognizer(props);

    // set initial state
    var currentPath = this.getLocation();
    var switchElement = this.getSwitch(currentPath);
    this.state = {
      visibleSwitch: switchElement
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

  componentWillReceiveProps(nextProps) {
    this.initializeRecognizer(nextProps);

    var currentPath = this.getLocation();
    var switchElement = this.getSwitch(currentPath);

    this.setState({
      visibleSwitch: switchElement
    });
  }

  initializeRecognizer(props) {
    this.recognizer = new Recognizer();
    var children = [].concat(props.children);
    children.forEach((child) => {
      this.recognizer.add([{
        path: `${props.basePath}${child.props.path}`,
        handler: child.props.handler || child
      }]);
    });
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
    var handlers = this.recognizer.recognize(path);
    return (handlers && handlers[0] && handlers[0].handler) || null;
  }

  handleRouteChange(e) {
    var currentPath = this.getLocation();
    var switchElement = this.getSwitch(currentPath);

    if(typeof this.props.onChange === 'function') {
      this.props.onChange(!!switchElement, currentPath);
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
