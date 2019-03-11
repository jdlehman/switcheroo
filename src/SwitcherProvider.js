import React, { Children, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import SwitcherContext from './context';

export default function SwitcherProvider(props) {
  const switcherProvider = useRef({
    loadListeners: [],
    popStateListeners: [],
    hashChangeListeners: []
  });

  useEffect(() => {
    const handleLoadListeners = e =>
      switcherProvider.current.loadListeners.forEach(({ fn }) => fn(e));
    const handlePopStateListeners = e =>
      switcherProvider.current.popStateListeners.forEach(({ fn }) => fn(e));
    const handleHashChangeListeners = e =>
      switcherProvider.current.hashChangeListeners.forEach(({ fn }) => fn(e));
    window.addEventListener('load', handleLoadListeners);
    window.addEventListener('popstate', handlePopStateListeners);
    window.addEventListener('hashchange', handleHashChangeListeners);
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
