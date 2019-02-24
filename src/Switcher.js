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
