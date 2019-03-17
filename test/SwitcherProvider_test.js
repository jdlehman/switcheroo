import React from 'react';
import { render, fireEvent, act } from 'react-testing-library';
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
    helpers.currentPath = jest.fn(() => ({ path: '/', params: {} }));
    const [top, bottom] = [jest.fn(), jest.fn()];
    renderNested({ top, bottom });

    fireEvent(window, new Event('load'));
    expect(top).toHaveBeenCalledTimes(1);
    expect(bottom).toHaveBeenCalledTimes(1);

    helpers.currentPath = jest.fn(() => ({ path: '/hello', params: {} }));
    // trigger hash change manually
    fireEvent(window, new HashChangeEvent('hashchange'));

    expect(top).toHaveBeenCalledTimes(2);
    expect(bottom).toHaveBeenCalledTimes(2);
    fireEvent(window, new HashChangeEvent('hashchange'));
    expect(top).toHaveBeenCalledTimes(3);
    expect(bottom).toHaveBeenCalledTimes(2);
  });
});

const SwitchedTo = ({ children }) => <div>{children}</div>;

function renderNested({ top = _ => _, bottom = _ => _ }) {
  return render(
    <SwitcherProvider>
      <div>
        <Switcher onChange={top}>
          <Switcher onChange={bottom} path="/">
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
