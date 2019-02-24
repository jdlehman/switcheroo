import React, { useContext, useRef, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import SwitcherContext from './context';
import {
  getSwitch,
  currentPath,
  getDynamicSegments,
  getActivePath,
  generateGuid
} from './helpers';

function getSwitchAndValues(props) {
  const { path, params } = currentPath(props.location);
  const visibleSwitch = getSwitch(path, props);
  const activePath = getActivePath(path, props.basePath, visibleSwitch);
  const dynamicValues = getDynamicSegments(path, props.basePath, visibleSwitch);
  return {
    visibleSwitch,
    dynamicValues,
    activePath,
    params,
    path
  };
}

function useForce() {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  return forceUpdate;
}

function Switcher(props) {
  const {
    mapDynamicSegments,
    renderSwitch,
    basePath,
    pushState,
    hashChange,
    location,
    load,
    wrapper: Wrapper,
    preventUpdate,
    ...passed
  } = props;

  const switcherProvider = useContext(SwitcherContext);

  const {
    visibleSwitch,
    dynamicValues,
    activePath,
    params
  } = getSwitchAndValues(props);

  const hashChangeOccurred = useForce();

  const handleSwitchChange = props => {
    const {
      visibleSwitch,
      dynamicValues,
      activePath,
      params,
      path
    } = getSwitchAndValues(props);

    if (typeof props.onChange === 'function') {
      props.onChange(
        Boolean(visibleSwitch),
        path,
        dynamicValues,
        activePath,
        params
      );
    }

    hashChangeOccurred();
  };

  const handleRouteChange = useRef();
  handleRouteChange.current = _ => handleSwitchChange(props);

  useEffect(() => {
    const handler = () => handleRouteChange.current();
    const usingProvider = Boolean(switcherProvider);
    if (!usingProvider) {
      load && window.addEventListener('load', handler);
      pushState && window.addEventListener('popstate', handler);
      hashChange && window.addEventListener('hashchange', handler);

      return () => {
        window.removeEventListener('load', handler);
        window.removeEventListener('popstate', handler);
        window.removeEventListener('hashchange', handler);
      };
    }

    const id = generateGuid();
    load &&
      switcherProvider.loadListeners.push({
        id,
        fn: handler
      });
    pushState &&
      switcherProvider.popStateListeners.push({
        id,
        fn: handler
      });
    hashChange &&
      switcherProvider.hashChangeListeners.push({
        id,
        fn: handler
      });
    return () => {
      load &&
        (switcherProvider.loadListeners = switcherProvider.loadListeners.filter(
          listener => listener.id !== id
        ));
      pushState &&
        (switcherProvider.popStateListeners = switcherProvider.popStateListeners.filter(
          listener => listener.id !== id
        ));
      hashChange &&
        (switcherProvider.hashChangeListeners = switcherProvider.hashChangeListeners.filter(
          listener => listener.id !== id
        ));
    };
  }, [load, pushState, hashChange, switcherProvider]);

  const lastChild = useRef(null);

  if (preventUpdate()) {
    return lastChild.current;
  }

  const { props: switchProps } = visibleSwitch || {};

  const visibleSwitchWithProps =
    visibleSwitch &&
    React.cloneElement(visibleSwitch, {
      ...switchProps,
      ...mapDynamicSegments(dynamicValues),
      activePath,
      params
    });

  if (renderSwitch) {
    const nextChild = renderSwitch(
      visibleSwitchWithProps,
      dynamicValues,
      activePath,
      params
    );
    lastChild.current = nextChild;
    return nextChild;
  }

  if (Wrapper) {
    Object.keys(Switcher.propTypes).forEach(k => delete passed[k]);
    const nextChild = <Wrapper {...passed}>{visibleSwitchWithProps}</Wrapper>;
    lastChild.current = nextChild;
    return nextChild;
  } else {
    lastChild.current = visibleSwitchWithProps;
    return visibleSwitchWithProps;
  }
}

Switcher.propTypes = {
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

Switcher.defaultProps = {
  pushState: false,
  hashChange: true,
  load: true,
  location: 'hash',
  basePath: '',
  preventUpdate: () => false,
  mapDynamicSegments: values => values
};

Switcher.displayName = 'Switcher';

export default Switcher;
