import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Switcher, { SwitcherProvider } from '../src';
import * as helpers from '../src/helpers';

describe('SwitcherProvider', function() {
  it('renders correctly', function() {
    sinon.stub(helpers, 'currentPath').returns('/');
    const component = renderComponent();
    expect(component.text()).toEqual('HomeHome');
    helpers.currentPath.restore();

    sinon.stub(helpers, 'currentPath').returns('/second');
    component.update();
    expect(component.text()).toEqual('Second');
    helpers.currentPath.restore();
  });
});

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
