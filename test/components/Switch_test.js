import React, {Component} from 'react/addons';
import {assert} from 'chai';
import sinon from 'sinon';
import Switch from 'components/Switch';

class NullComponent extends Component {
  render() {
    return false;
  }
}

describe('Switch', function() {

  it('calls show/hide functions on mount/unmount', function() {
    var hide = sinon.spy(),
        show = sinon.spy();

    this.switchComponent = React.render(
      <Switch
          handler={NullComponent}
          onHide={hide}
          onShow={show} />,
      document.body
    );
    assert(show.calledOnce, 'show was not called on mount');
    React.unmountComponentAtNode(document.body);
    assert(hide.calledOnce, 'hide was not called on unmount');
  });

});
