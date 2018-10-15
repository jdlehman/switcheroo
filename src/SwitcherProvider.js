import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { Provider, createListenerContext } from './listenerContext';

export default class SwitcherProvider extends Component {
  static displayName = 'SwitcherProvider';

  constructor(props) {
    super(props);
    this._listenerContext = createListenerContext(true);
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

  handleLoadListeners = e => {
    this._listenerContext.listeners.load.forEach(({ fn }) => fn(e));
  };

  handlePopStateListeners = e => {
    this._listenerContext.listeners.popState.forEach(({ fn }) => fn(e));
  };

  handleHashChangeListeners = e => {
    this._listenerContext.listeners.hashChange.forEach(({ fn }) => fn(e));
  };

  render() {
    if (Children.count(this.props.children) > 1) {
      return (
        <Provider value={this._listenerContext}>
          <span className="switcher-provider">{this.props.children}</span>
        </Provider>
      );
    } else {
      return (
        <Provider value={this._listenerContext}>{this.props.children}</Provider>
      );
    }
  }
}
