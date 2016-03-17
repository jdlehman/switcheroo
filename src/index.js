import React, {Component, PropTypes} from 'react';
import {
  getSwitch,
  currentPath
} from './helpers';

export default class Switcher extends Component {
  static displayName = 'Switcher';

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    pushState: PropTypes.bool,
    hashChange: PropTypes.bool,
    load: PropTypes.bool,
    onChange: PropTypes.func,
    wrapper: PropTypes.any,
    location: PropTypes.string,
    basePath: PropTypes.string,
    preventUpdate: PropTypes.func
  };

  static defaultProps = {
    pushState: false,
    hashChange: true,
    load: true,
    location: 'hash',
    basePath: '',
    preventUpdate: () => false
  };

  constructor(props) {
    super(props);

    var currPath = currentPath(props.location);
    var switchElement = getSwitch(currPath, props);
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
    this.handleSwitchChange(nextProps);
  }

  shouldComponentUpdate(nextProps) {
    return !nextProps.preventUpdate();
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

  handleSwitchChange = (props) => {
    var currPath = currentPath(props.location);
    var switchElement = getSwitch(currPath, props);

    if (typeof props.onChange === 'function') {
      props.onChange(!!switchElement, currPath);
    }

    this.setState({
      visibleSwitch: switchElement
    });
  };

  handleRouteChange = (ev) => {
    this.handleSwitchChange(this.props);
  };

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
