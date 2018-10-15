import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Consumer } from './listenerContext';
import Switcher from './Switcher';

export default class SwitcherConsumer extends Component {
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

  static defaultProps = {
    pushState: false,
    hashChange: true,
    load: true,
    location: 'hash',
    basePath: '',
    preventUpdate: () => false,
    mapDynamicSegments: values => values
  };

  render() {
    return (
      <Consumer>
        {({
          usingProvider,
          addLoadListener,
          addPopStateListener,
          addHashChangeListener,
          removeListeners
        }) => {
          return (
            <Switcher
              {...this.props}
              usingProvider={usingProvider}
              addLoadListener={addLoadListener}
              addPopStateListener={addPopStateListener}
              addHashChangeListener={addHashChangeListener}
              removeListeners={removeListeners}
            />
          );
        }}
      </Consumer>
    );
  }
}
