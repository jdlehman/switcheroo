import { createContext } from 'react';

function createListenerContext(usingProvider) {
  const listeners = {
    load: [],
    popState: [],
    hashChange: []
  };

  return {
    usingProvider,
    listeners,
    addLoadListener: ({ id, fn }) => listeners.load.push({ id, fn }),
    addPopStateListener: ({ id, fn }) => listeners.popState.push({ id, fn }),
    addHashChangeListener: ({ id, fn }) =>
      listeners.hashChange.push({ id, fn }),
    removeListeners: removeId => {
      listeners.load = listeners.load.filter(({ id }) => id !== removeId);
      listeners.popState = listeners.popState.filter(
        ({ id }) => id !== removeId
      );
      listeners.hashChange = listeners.hashChange.filter(
        ({ id }) => id !== removeId
      );
    }
  };
}

const { Provider, Consumer } = createContext(createListenerContext(false));

export { createListenerContext, Provider, Consumer };
