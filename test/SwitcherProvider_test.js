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

function renderNested() {
  return mount(
    <SwitcherProvider>
      <div>
        <Switcher>
          <Switcher path="/">
            <div path={['/', '/other']}>Home</div>
            <div path="/second">Second</div>
          </Switcher>
          <div path="/hello">Hello</div>
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
          <div path="/">Home</div>
        </Switcher>
        <Switcher>
          <div path={['/', '/other']}>Home</div>
          <div path="/second">Second</div>
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
          <div path="/">Home</div>
        </Switcher>
        <Switcher>
          <div path={['/', '/other']}>Home</div>
          <div path="/second">Second</div>
        </Switcher>
      </div>
    </SwitcherProvider>
  );
}
