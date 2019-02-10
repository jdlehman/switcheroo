import React, { Children, Component, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Provider, createListenerContext } from './listenerContext';

export default function SwitcherProvider(props) {
  const _listenerContext = useRef(createListenerContext(true));
  useEffect(() => {
    const handleLoadListeners = e => {
      _listenerContext.listeners.load.forEach(({ fn }) => fn(e));
    };

    const handlePopStateListeners = e => {
      _listenerContext.listeners.popState.forEach(({ fn }) => fn(e));
    };

    const handleHashChangeListeners = e => {
      _listenerContext.listeners.hashChange.forEach(({ fn }) => fn(e));
    };
    window.addEventListener('load', handleLoadListeners);
    window.addEventListener('popstate', handlePopStateListeners);
    window.addEventListener('hashchange', handleHashChangeListeners);

    return () => {
      window.removeEventListener('load', handleLoadListeners);
      window.removeEventListener('popstate', handlePopStateListeners);
      window.removeEventListener('hashchange', handleHashChangeListeners);
    };
  }, []);

  const { children } = props;
  if (Children.count(children) > 1) {
    return (
      <Provider value={_listenerContext}>
        <span className="switcher-provider">{children}</span>
      </Provider>
    );
  }
  return <Provider value={_listenerContext}>{children}</Provider>;
}

SwitcherProvider.displayName = 'SwitcherProvider';
