import React from 'react';
import { mount } from 'enzyme';
import Switcher, { SwitcherProvider } from '../src';
import * as helpers from '../src/helpers';

describe('SwitcherProvider', () => {
  afterEach(() => jest.restoreAllMocks());
  it('renders correctly', () => {
    helpers.currentPath = jest.fn(() => ({ path: '/', params: {} }));

    const component = renderComponent();
    expect(component.text()).toEqual('HomeHome');

    helpers.currentPath = jest.fn(() => ({ path: '/second', params: {} }));
    // trigger hash change manually
    component.instance().handleHashChangeListeners();
    component.update();
    expect(component.text()).toEqual('Second');
  });

  it('wraps a span around multiple children', () => {
    helpers.currentPath = jest.fn().mockReturnValue({ path: '/', params: {} });
    const component = renderComponentWithManyChildren();
    expect(component.find('.switcher-provider').length).toEqual(1);
    expect(component.text()).toEqual('Another ChildHomeHome');
  });

  it('removes event listeners when a child Switcher is unmounted', () => {
    helpers.currentPath = jest.fn(() => ({ path: '/', params: {} }));
    const component = renderNested();
    const innerSwitcher = component.find('Switcher').last();
    const listenerId = innerSwitcher.instance()._id;
    const instance = component.instance();

    expect(instance.switcherProvider.loadListeners.length).toEqual(2);
    expect(instance.switcherProvider.hashChangeListeners.length).toEqual(2);
    expect(
      instance.switcherProvider.loadListeners
        .map(({ id }) => id)
        .indexOf(listenerId)
    ).not.toEqual(-1);
    expect(
      instance.switcherProvider.hashChangeListeners
        .map(({ id }) => id)
        .indexOf(listenerId)
    ).not.toEqual(-1);

    helpers.currentPath = jest.fn(() => ({ path: '/hello', params: {} }));
    // trigger hash change manually
    component.instance().handleHashChangeListeners();
    component.update();
    expect(instance.switcherProvider.loadListeners.length).toEqual(1);
    expect(instance.switcherProvider.hashChangeListeners.length).toEqual(1);
    expect(
      instance.switcherProvider.loadListeners
        .map(({ id }) => id)
        .indexOf(listenerId)
    ).toEqual(-1);
    expect(
      instance.switcherProvider.hashChangeListeners
        .map(({ id }) => id)
        .indexOf(listenerId)
    ).toEqual(-1);
  });
});

const SwitchedTo = ({ children }) => <div>{children}</div>;

function renderNested() {
  return mount(
    <SwitcherProvider>
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
  return mount(
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
  return mount(
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
