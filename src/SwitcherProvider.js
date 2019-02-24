import React, { Children, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import SwitcherContext from './context';

export default function SwitcherProvider(props) {
  const switcherProvider = useRef({
    loadListeners: [],
    popStateListeners: [],
    hashChangeListeners: []
  });

  const handleLoadListeners = useRef();
  handleLoadListeners.current = e => {
    switcherProvider.current.loadListeners.forEach(({ fn }) => fn(e));
  };

  const handlePopStateListeners = useRef();
  handlePopStateListeners.current = e => {
    switcherProvider.current.popStateListeners.forEach(({ fn }) => fn(e));
  };

  const handleHashChangeListeners = useRef();
  handleHashChangeListeners.current = e => {
    switcherProvider.current.hashChangeListeners.forEach(({ fn }) => fn(e));
  };

  useEffect(() => {
    const handleLoad = e => handleLoadListeners.current(e);
    const handlePopState = e => handlePopStateListeners.current(e);
    const handleHashChange = e => handleHashChangeListeners.current(e);
    window.addEventListener('load', handleLoad);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChanged);
    };
  }, []);

  return (
    <SwitcherContext.Provider value={switcherProvider.current}>
      {(() => {
        if (Children.count(props.children) > 1) {
          return <span className="switcher-provider">{props.children}</span>;
        } else {
          return props.children;
        }
      })()}
    </SwitcherContext.Provider>
  );
}

SwitcherProvider.displayName = 'SwitcherProvider';

SwitcherProvider.propTypes = {
  children: PropTypes.node
};
