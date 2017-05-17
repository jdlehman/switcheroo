import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  getSwitch,
  currentPath,
  getDynamicSegments,
  getActivePath,
  generateGuid
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
    preventUpdate: PropTypes.func,
    mapDynamicSegments: PropTypes.func,
    renderSwitch: PropTypes.func
  };

  static contextTypes = {
    switcherProvider: PropTypes.shape({
      loadListeners: PropTypes.array.isRequired,
      popStateListeners: PropTypes.array.isRequired,
      hashChangeListeners: PropTypes.array.isRequired
    })
  };

  static defaultProps = {
    pushState: false,
    hashChange: true,
    load: true,
    location: 'hash',
    basePath: '',
    preventUpdate: () => false,
    mapDynamicSegments: values => values
  };

  constructor(props) {
    super(props);

    const currPath = currentPath(props.location);
    const visibleSwitch = getSwitch(currPath, props);
    const activePath = getActivePath(currPath, props.basePath, visibleSwitch);
    const dynamicValues = getDynamicSegments(
      currPath,
      props.basePath,
      visibleSwitch
    );
    this.state = {
      visibleSwitch,
      dynamicValues,
      activePath
    };
  }

  componentDidMount() {
    const usingProvider = this.context.switcherProvider;
    if (usingProvider) {
      this._id = generateGuid();
    }

    if (this.props.load) {
      usingProvider
        ? this.context.switcherProvider.loadListeners.push({
            id: this._id,
            fn: this.handleRouteChange
          })
        : window.addEventListener('load', this.handleRouteChange);
    }
    if (this.props.pushState) {
      usingProvider
        ? this.context.switcherProvider.popStateListeners.push({
            id: this._id,
            fn: this.handleRouteChange
          })
        : window.addEventListener('popstate', this.handleRouteChange);
    }
    if (this.props.hashChange) {
      usingProvider
        ? this.context.switcherProvider.hashChangeListeners.push({
            id: this._id,
            fn: this.handleRouteChange
          })
        : window.addEventListener('hashchange', this.handleRouteChange);
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

  handleSwitchChange = props => {
    const currPath = currentPath(props.location);
    const visibleSwitch = getSwitch(currPath, props);
    const activePath = getActivePath(currPath, props.basePath, visibleSwitch);
    const dynamicValues = getDynamicSegments(
      currPath,
      props.basePath,
      visibleSwitch
    );

    if (typeof props.onChange === 'function') {
      props.onChange(!!visibleSwitch, currPath, dynamicValues, activePath);
    }

    this.setState({ visibleSwitch, dynamicValues, activePath });
  };

  handleRouteChange = ev => {
    this.handleSwitchChange(this.props);
  };

  render() {
    const { props } = this.state.visibleSwitch || {};
    const visibleSwitch =
      this.state.visibleSwitch &&
      React.cloneElement(this.state.visibleSwitch, {
        ...props,
        ...this.props.mapDynamicSegments(this.state.dynamicValues),
        activePath: this.state.activePath
      });

    if (this.props.renderSwitch) {
      return this.props.renderSwitch(
        visibleSwitch,
        this.state.dynamicValues,
        this.state.activePath
      );
    }

    if (this.props.wrapper) {
      const passedProps = { ...this.props };
      Object.keys(Switcher.propTypes).forEach(k => delete passedProps[k]);
      return React.createElement(
        this.props.wrapper,
        passedProps,
        visibleSwitch
      );
    } else {
      return visibleSwitch;
    }
  }
}
