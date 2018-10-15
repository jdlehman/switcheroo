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
    renderSwitch: PropTypes.func,
    usingProvider: PropTypes.bool,
    addLoadListener: PropTypes.func,
    addPopStateListener: PropTypes.func,
    addHashChangeListener: PropTypes.func,
    removeListeners: PropTypes.func
  };

  static defaultProps = {
    pushState: false,
    hashChange: true,
    load: true,
    location: 'hash',
    basePath: '',
    preventUpdate: () => false,
    mapDynamicSegments: values => values,
    usingProvider: false,
    addLoadListener: () => {},
    addPopStateListener: () => {},
    addHashChangeListener: () => {},
    removeListeners: () => {}
  };

  constructor(props) {
    super(props);

    const { path, params } = currentPath(props.location);
    const visibleSwitch = getSwitch(path, props);
    const activePath = getActivePath(path, props.basePath, visibleSwitch);
    const dynamicValues = getDynamicSegments(
      path,
      props.basePath,
      visibleSwitch
    );
    this.state = {
      visibleSwitch,
      dynamicValues,
      activePath,
      params
    };
  }

  componentDidMount() {
    if (this.props.usingProvider) {
      this._id = generateGuid();
    }

    if (this.props.load) {
      this.props.usingProvider
        ? this.props.addLoadListener({
            id: this._id,
            fn: this.handleRouteChange
          })
        : window.addEventListener('load', this.handleRouteChange);
    }
    if (this.props.pushState) {
      this.props.usingProvider
        ? this.props.addPopStateListener({
            id: this._id,
            fn: this.handleRouteChange
          })
        : window.addEventListener('popstate', this.handleRouteChange);
    }
    if (this.props.hashChange) {
      this.props.usingProvider
        ? this.props.addHashChangeListener({
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
    if (this.props.usingProvider) {
      this.props.removeListeners(this._id);
    } else {
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
  }

  handleSwitchChange = props => {
    const { path, params } = currentPath(props.location);
    const visibleSwitch = getSwitch(path, props);
    const activePath = getActivePath(path, props.basePath, visibleSwitch);
    const dynamicValues = getDynamicSegments(
      path,
      props.basePath,
      visibleSwitch
    );

    if (typeof props.onChange === 'function') {
      props.onChange(!!visibleSwitch, path, dynamicValues, activePath, params);
    }

    this.setState({ visibleSwitch, dynamicValues, activePath, params });
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
        activePath: this.state.activePath,
        params: this.state.params
      });

    if (this.props.renderSwitch) {
      return this.props.renderSwitch(
        visibleSwitch,
        this.state.dynamicValues,
        this.state.activePath,
        this.state.params
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
