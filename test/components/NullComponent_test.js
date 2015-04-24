import React from 'react/addons';
import {assert} from 'chai';
import NullComponent from 'components/NullComponent';

describe('NullComponent', function() {

  beforeEach(function() {
    this.nullComponent = React.render(<NullComponent />, document.body);
  });

  afterEach(function() {
    document.body.innerHTML = '';
  });

  it('renders nothing', function() {
    assert.equal(React.findDOMNode(this.nullComponent), null);
  });

});
