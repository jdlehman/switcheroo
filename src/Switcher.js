import React, { useState, useRef, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import {
  getSwitch,
  currentPath,
  getDynamicSegments,
  getActivePath,
  generateGuid
} from './helpers';

const Switcher = (props, { switcherProvider }) => {
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
  const { path, params: currParams } = currentPath(location);

  const [visibleSwitch, setVisibleSwitch] = useState(getSwitch(path, props));
  const [activePath, setActivePath] = useState(
    getActivePath(path, basePath, visibleSwitch)
  );
  const [dynamicValues, setDynamicValues] = useState(
    getDynamicSegments(path, basePath, visibleSwitch)
  );

  const [params, setParams] = useState(currParams);

  const usingProvider = Boolean(switcherProvider);

  const [_id] = useReducer(_ => _, () => usingProvider && generateGuid());

  const handleSwitchChange = props => {
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
    setVisibleSwitch(visibleSwitch);
    setDynamicValues(dynamicValues);
    setActivePath(activePath);
    setParams(params);
  };

  useEffect(() => {
    const handleRouteChange = ev => handleSwitchChange(props);
    if (load) {
      usingProvider
        ? switcherProvider.loadListeners.push({
            id: _id,
            fn: handleRouteChange
          })
        : window.addEventListener('load', handleRouteChange);
    }
    if (pushState) {
      usingProvider
        ? switcherProvider.popStateListeners.push({
            id: _id,
            fn: handleRouteChange
          })
        : window.addEventListener('popstate', handleRouteChange);
    }
    if (hashChange) {
      usingProvider
        ? switcherProvider.hashChangeListeners.push({
            id: _id,
            fn: handleRouteChange
          })
        : window.addEventListener('hashchange', handleRouteChange);
    }
    return () => {
      if (load) {
        if (usingProvider) {
          switcherProvider.loadListeners = switcherProvider.loadListeners.filter(
            ({ id }) => id !== _id
          );
        } else {
          window.removeEventListener('load', handleRouteChange);
        }
      }
      if (pushState) {
        if (usingProvider) {
          switcherProvider.popStateListeners = switcherProvider.popStateListeners.filter(
            ({ id }) => id !== _id
          );
        } else {
          window.removeEventListener('popstate', handleRouteChange);
        }
      }
      if (hashChange) {
        if (usingProvider) {
          switcherProvider.hashChangeListeners = switcherProvider.hashChangeListeners.filter(
            ({ id }) => id !== _id
          );
        } else {
          window.removeEventListener('hashchange', handleRouteChange);
        }
      }
    };
  }, [load, pushState, hashChange]);

  const { props: switchProps } = visibleSwitch || {};

  const lastChild = useRef(null);

  const visibleSwitchWithProps =
    visibleSwitch &&
    React.cloneElement(visibleSwitch, {
      ...switchProps,
      ...mapDynamicSegments(dynamicValues),
      activePath: activePath,
      params: params
    });

  if (preventUpdate()) {
    return lastChild.current;
  }

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
};

Switcher.contextTypes = {
  switcherProvider: PropTypes.shape({
    loadListeners: PropTypes.array.isRequired,
    popStateListeners: PropTypes.array.isRequired,
    hashChangeListeners: PropTypes.array.isRequired
  })
};

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
