import React, { useEffect, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import SwitcherContext from '../src/context';

export const ContextReporter = () => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const { loadListeners, hashChangeListeners } = useContext(SwitcherContext);

  useEffect(() => {
    setTimeout(forceUpdate);
    const update = () => {
      // because we can't rely on order of rendering here, we'll have to wait
      setTimeout(forceUpdate);
    };
    window.addEventListener('hashchange', update);
    return () => {
      window.removeEventListener('hashchange', update);
    };
  }, [forceUpdate]);

  return (
    <article>
      <p className="loadListeners">
        {loadListeners.map(({ id }) => (
          <em key={id}>{id}</em>
        ))}
      </p>
      <p className="hashChangeListeners">
        {hashChangeListeners.map(({ id }) => (
          <em key={id}>{id}</em>
        ))}
      </p>
    </article>
  );
};
