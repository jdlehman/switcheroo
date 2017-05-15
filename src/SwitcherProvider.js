import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';

export default class SwitcherProvider extends Component {
  static displayName = 'SwitcherProvider';

  static propTypes = {
    children: PropTypes.node
  };

  static childContextTypes = {
    switcherProvider: PropTypes.shape({
      loadListeners: PropTypes.array.isRequired,
      popStateListeners: PropTypes.array.isRequired,
      hashChangeListeners: PropTypes.array.isRequired
    })
  };

  getChildContext() {
    return { switcherProvider: this.switcherProvider };
  }

  componentDidMount() {
    window.addEventListener('load', this.handleLoadListeners);
    window.addEventListener('popstate', this.handlePopStateListeners);
    window.addEventListener('hashchange', this.handleHashChangeListeners);
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.handleLoadListeners);
    window.removeEventListener('popstate', this.handlePopStateListeners);
    window.removeEventListener('hashchange', this.handleHashChangeListeners);
  }

  switcherProvider = {
    loadListeners: [],
    popStateListeners: [],
    hashChangeListeners: []
  };

  handleLoadListeners = e => {
    this.switcherProvider.loadListeners.forEach(({ fn }) => fn(e));
  };

  handlePopStateListeners = e => {
    this.switcherProvider.popStateListeners.forEach(({ fn }) => fn(e));
  };

  handleHashChangeListeners = e => {
    this.switcherProvider.hashChangeListeners.forEach(({ fn }) => fn(e));
  };

  render() {
    if (Children.count(this.props.children) > 1) {
      return <span className="switcher-provider">{this.props.children}</span>;
    } else {
      return this.props.children;
    }
  }
}
