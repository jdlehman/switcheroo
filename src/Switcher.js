// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  getSwitch,
  currentPath,
  getDynamicSegments,
  getActivePath,
  generateGuid
} from './helpers';

type Props = {
  children: React.Element<*>,
  pushState: boolean,
  hashChange: boolean,
  load: boolean,
  onChange?: (
    visibleSwitch: boolean,
    path: string,
    dynamicValues: {},
    activePath: ?string,
    params: {}
  ) => void,
  wrapper?: ReactClass<*>,
  location: string,
  basePath: string,
  preventUpdate: () => boolean,
  mapDynamicSegments: (segments: {}) => {},
  renderSwitch?: (
    visibleSwitch: ?React.Element<*>,
    dynamicValues: {},
    activePath: ?string,
    params: {}
  ) => void
};

type DefaultProps = {
  pushState: boolean,
  hashChange: boolean,
  load: boolean,
  location: string,
  basePath: string,
  preventUpdate: () => boolean,
  mapDynamicSegments: (segments: {}) => {}
};

type State = {
  visibleSwitch: ?React.Element<*>,
  dynamicValues: {},
  activePath: ?string,
  params: {}
};

export default class Switcher extends Component<DefaultProps, Props, State> {
  static displayName = 'Switcher';

  static defaultProps = {
    pushState: false,
    hashChange: true,
    load: true,
    location: 'hash',
    basePath: '',
    preventUpdate: () => false,
    mapDynamicSegments: (segments: {}) => (segments: {})
  };

  static contextTypes = {
    switcherProvider: PropTypes.shape({
      loadListeners: PropTypes.array.isRequired,
      popStateListeners: PropTypes.array.isRequired,
      hashChangeListeners: PropTypes.array.isRequired
    })
  };

  state: State;
  _id: ?string;

  constructor(props: Props) {
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
    const usingProvider: ?boolean = this.context.switcherProvider;
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

  componentWillReceiveProps(nextProps: Props) {
    this.handleSwitchChange(nextProps);
  }

  shouldComponentUpdate(nextProps: Props) {
    return !nextProps.preventUpdate();
  }

  componentWillUnmount() {
    const usingProvider = this.context.switcherProvider;
    if (this.props.load) {
      if (usingProvider) {
        this.context.switcherProvider.loadListeners = this.context.switcherProvider.loadListeners.filter(
          ({ id }) => id !== this._id
        );
      } else {
        window.removeEventListener('load', this.handleRouteChange);
      }
    }
    if (this.props.pushState) {
      if (usingProvider) {
        this.context.switcherProvider.popStateListeners = this.context.switcherProvider.popStateListeners.filter(
          ({ id }) => id !== this._id
        );
      } else {
        window.removeEventListener('popstate', this.handleRouteChange);
      }
    }
    if (this.props.hashChange) {
      if (usingProvider) {
        this.context.switcherProvider.hashChangeListeners = this.context.switcherProvider.hashChangeListeners.filter(
          ({ id }) => id !== this._id
        );
      } else {
        window.removeEventListener('hashchange', this.handleRouteChange);
      }
    }
  }

  handleSwitchChange = (props: Props) => {
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

  handleRouteChange = (ev: Event) => {
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
        this.props.wrapper || 'span',
        passedProps,
        visibleSwitch
      );
    } else {
      return visibleSwitch;
    }
  }
}
