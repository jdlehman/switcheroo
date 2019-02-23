import React from 'react';
import { render, fireEvent, act } from 'react-testing-library';
import Switcher, { SwitcherProvider } from '../src';
import * as helpers from '../src/helpers';
import { ContextReporter } from './utils';

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

  jest.useFakeTimers();
  test('removes event listeners when a child Switcher is unmounted', async () => {
    helpers.generateGuid = jest
      .fn()
      .mockReturnValueOnce('bottom')
      .mockReturnValueOnce('top');
    helpers.currentPath = jest.fn(() => ({ path: '/', params: {} }));
    const component = renderNested();
    act(() => {
      jest.runAllTimers();
    });
    const getListeners = type => {
      return Array.from(
        component.container.querySelectorAll(`.${type}Listeners em`)
      ).map(el => el.textContent);
    };

    expect(getListeners('load')).toEqual(['bottom', 'top']);
    expect(getListeners('hashChange')).toEqual(['bottom', 'top']);

    helpers.currentPath = jest.fn(() => ({ path: '/hello', params: {} }));
    // trigger hash change manually
    fireEvent(window, new HashChangeEvent('hashchange'));
    act(jest.runAllTimers);

    expect(getListeners('load')).toEqual(['top']);
    expect(getListeners('hashChange')).toEqual(['top']);
  });
});

const SwitchedTo = ({ children }) => <div>{children}</div>;

function renderNested() {
  return render(
    <SwitcherProvider>
      <ContextReporter />
      <div>
        <Switcher>
          <Switcher path="/">
            <SwitchedTo path={['/', '/other']}>Home</SwitchedTo>
            <SwitchedTo path="/second">Second</SwitchedTo>
          </Switcher>
          <SwitchedTo path="/hello">Hello</SwitchedTo>
        </Switcher>
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
