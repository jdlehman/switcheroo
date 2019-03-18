import React, { useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import SwitcherContext from './context';

export default function SwitcherProvider(props) {
  const loadListeners = useRef([]);
  const popStateListeners = useRef([]);
  const hashChangeListeners = useRef([]);

  useEffect(() => {
    const handleLoadListeners = e => loadListeners.current.forEach(fn => fn(e));
    const handlePopStateListeners = e =>
      popStateListeners.current.forEach(fn => fn(e));
    const handleHashChangeListeners = e =>
      hashChangeListeners.current.forEach(fn => fn(e));
    window.addEventListener('load', handleLoadListeners);
    window.addEventListener('popstate', handlePopStateListeners);
    window.addEventListener('hashchange', handleHashChangeListeners);
    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChanged);
    };
  }, []);

  const providedMethods = useMemo(() => {
    const getListenerList = type => {
      switch (type) {
        case 'load':
          return loadListeners.current;
        case 'popstate':
          return popStateListeners.current;
        case 'hashchange':
          return hashChangeListeners.current;
        default:
          throw new Error(
            `"${type}" is not a valid listener type. listener types are load|popstate|hashchange.`
          );
      }
    };
    return {
      addListener: (type, fn) => {
        getListenerList(type).push(fn);
      },
      removeListener: (type, fn) => {
        const listeners = getListenerList(type);
        listeners.splice(listeners.indexOf(fn), 1);
      }
    };
  }, []);

  return (
    <SwitcherContext.Provider value={providedMethods}>
      {props.children}
    </SwitcherContext.Provider>
  );
}

SwitcherProvider.displayName = 'SwitcherProvider';

SwitcherProvider.propTypes = {
  children: PropTypes.node
};
