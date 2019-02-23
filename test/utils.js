import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { act } from 'react-dom/test-utils';

export const ContextReporter = (
  _,
  { switcherProvider: { loadListeners, hashChangeListeners } }
) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  // refresh bc old context SUX
  useEffect(() => {
    setTimeout(forceUpdate);
  }, [forceUpdate]);

  useEffect(() => {
    const doIt = () => {
      // because we can't rely on order of rendering here, we'll have to wait
      // oh yeah and old context SUX
      setTimeout(forceUpdate);
    };
    window.addEventListener('hashchange', doIt);
    return () => {
      window.removeEventListener('hashchange', doIt);
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

ContextReporter.contextTypes = {
  switcherProvider: PropTypes.object
};
