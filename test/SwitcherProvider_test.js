import React, { useEffect, useReducer } from 'react';
import { act } from 'react-dom/test-utils';
import PropTypes from 'prop-types';
import {
  render,
  fireEvent,
  waitForDomChange,
  wait
} from 'react-testing-library';
import Switcher, { SwitcherProvider } from '../src';
import * as helpers from '../src/helpers';

describe('SwitcherProvider', () => {
  afterEach(() => jest.restoreAllMocks());
  test('renders correctly', () => {
    helpers.currentPath = jest.fn(() => ({ path: '/', params: {} }));

    const component = renderComponent();
    expect(component.container).toHaveTextContent('HomeHome');

    helpers.currentPath = jest.fn(() => ({ path: '/second', params: {} }));

    fireEvent(window, new HashChangeEvent('hashchange'));

    expect(component.container).toHaveTextContent('Second');
  });

  test('wraps a span around multiple children', () => {
    helpers.currentPath = jest.fn().mockReturnValue({ path: '/', params: {} });
    const component = renderComponentWithManyChildren();
    expect(component.container).toHaveTextContent('Another ChildHomeHome');
  });

  test('removes event listeners when a child Switcher is unmounted', async () => {
    helpers.generateGuid = jest
      .fn()
      .mockReturnValueOnce('top')
      .mockReturnValueOnce('bottom');
    helpers.currentPath = jest.fn(() => ({ path: '/', params: {} }));

    const component = renderNested();

    await wait(() => {
      const loadListeners = Array.from(
        component.container.querySelectorAll('.loadListeners em')
      ).map(el => el.textContent);
      expect(loadListeners).toEqual(['bottom', 'top']);

      const hashChangeListeners = Array.from(
        component.container.querySelectorAll('.hashChangeListeners em')
      ).map(el => el.textContent);
      expect(hashChangeListeners).toEqual(['bottom', 'top']);
    });

    helpers.currentPath = jest.fn(() => ({ path: '/hello', params: {} }));
    // trigger hash change manually
    fireEvent(window, new HashChangeEvent('hashchange'));
    await wait(() => {
      const loadListeners = Array.from(
        component.container.querySelectorAll('.loadListeners em')
      ).map(el => el.textContent);
      expect(loadListeners).toEqual(['top']);

      const hashChangeListeners = Array.from(
        component.container.querySelectorAll('.hashChangeListeners em')
      ).map(el => el.textContent);
      expect(hashChangeListeners).toEqual(['top']);
    });
  });
});

const SwitchedTo = ({ children }) => <div>{children}</div>;

const ContextReporter = (
  _,
  { switcherProvider: { loadListeners, hashChangeListeners } }
) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  //refresh bc old context SUX
  useEffect(() => {
    setTimeout(forceUpdate);
  }, []);

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
  }, []);
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

function renderNested() {
  return render(
    <SwitcherProvider>
      <div>
        <Switcher>
          <Switcher path="/">
            <SwitchedTo path={['/', '/other']}>Home</SwitchedTo>
            <SwitchedTo path="/second">Second</SwitchedTo>
          </Switcher>
          <SwitchedTo path="/hello">Hello</SwitchedTo>
        </Switcher>
        <ContextReporter />
      </div>
    </SwitcherProvider>
  );
}

function renderComponent() {
  return render(
    <SwitcherProvider>
      <div>
        <Switcher>
          <SwitchedTo path="/">Home</SwitchedTo>
        </Switcher>
        <Switcher>
          <SwitchedTo path={['/', '/other']}>Home</SwitchedTo>
          <SwitchedTo path="/second">Second</SwitchedTo>
        </Switcher>
      </div>
    </SwitcherProvider>
  );
}

function renderComponentWithManyChildren() {
  return render(
    <SwitcherProvider>
      <div>Another Child</div>
      <div>
        <Switcher>
          <SwitchedTo path="/">Home</SwitchedTo>
        </Switcher>
        <Switcher>
          <SwitchedTo path={['/', '/other']}>Home</SwitchedTo>
          <SwitchedTo path="/second">Second</SwitchedTo>
        </Switcher>
      </div>
    </SwitcherProvider>
  );
}
