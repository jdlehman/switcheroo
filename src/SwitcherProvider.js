import React, {
  Children,
  useRef,
  useEffect,
  useCallback,
  useMemo
} from 'react';
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
      switcherProvider.current.loadListeners.forEach(fn => fn(e));
    const handlePopStateListeners = e =>
      switcherProvider.current.popStateListeners.forEach(fn => fn(e));
    const handleHashChangeListeners = e =>
      switcherProvider.current.hashChangeListeners.forEach(fn => fn(e));
    window.addEventListener('load', handleLoadListeners);
    window.addEventListener('popstate', handlePopStateListeners);
    window.addEventListener('hashchange', handleHashChangeListeners);
    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChanged);
    };
  }, []);

  const getListenerList = useCallback(type => {
    switch (type) {
      case 'load':
        return switcherProvider.current.loadListeners;
      case 'popstate':
        return switcherProvider.current.popStateListeners;
      case 'hashchange':
        return switcherProvider.current.hashChangeListeners;
      default:
        throw new Error('womp womp');
    }
  }, []);

  const addListener = useCallback(
    (type, fn) => {
      getListenerList(type).push(fn);
    },
    [getListenerList]
  );

  const removeListener = useCallback(
    (type, fn) => {
      const listeners = getListenerList(type);
      listeners.splice(listeners.indexOf(fn), 1);
    },
    [getListenerList]
  );

  const providedMethods = useMemo(() => {
    return {
      addListener,
      removeListener
    };
  }, [addListener, removeListener]);

  return (
    <SwitcherContext.Provider value={providedMethods}>
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
