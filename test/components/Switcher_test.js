import React, {Component} from 'react';
import {assert} from 'chai';
import sinon from 'sinon';
import window from 'window';
import Switcher from 'components/Switcher';

class Handler extends Component {
  render() {
    return <div>{this.props.text}</div>;
  }
}

describe('Switcher', function() {

  describe('#getLocation', function() {
    describe('using location.hash', function() {
      beforeEach(function() {
        this.switcher = React.render(
          <Switcher>
            <div path="/">Home</div>
            <div path="/another">Another</div>
          </Switcher>,
          document.body
        );
      });

      afterEach(function() {
        React.unmountComponentAtNode(document.body);
      });

      it('gets hash by default', function() {
        window.location.hash = '/path';
        var location = this.switcher.getLocation();
        assert.equal(location, '/path');
      });

      it('ensures that location is prepended with a slash', function() {
        window.location.hash = 'path';
        var location = this.switcher.getLocation();
        assert.equal(location, '/path');
      });

      it('does not include query parameters', function() {
        window.location.hash = '/path?a=2&b=3&c=hello';
        var location = this.switcher.getLocation();
        assert.equal(location, '/path');
      });
    });

    describe('using location.pathname', function() {
      beforeEach(function() {
        this.switcher = React.render(
          <Switcher location="pathname">
            <div path="/">Home</div>
            <div path="/another">Another</div>
          </Switcher>,
          document.body
        );
      });

      afterEach(function() {
        React.unmountComponentAtNode(document.body);
      });

      it('gets hash by default', function() {
        window.history.pushState({}, '', '/path');
        var location = this.switcher.getLocation();
        assert.equal(location, '/path');
      });

      it('ensures that location is prepended with a slash', function() {
        window.history.pushState({}, '', 'path');
        var location = this.switcher.getLocation();
        assert.equal(location, '/path');
      });

      it('does not include query parameters', function() {
        window.history.pushState({}, '', '/path?a=2&b=3&c=hello');
        var location = this.switcher.getLocation();
        assert.equal(location, '/path');
      });
    });
  });

  describe('#getSwitch', function() {
    beforeEach(function() {
      this.switcher = React.render(
        <Switcher>
          <div path="/">Home</div>
          <div path="/another">Another</div>
          <div path="/duplicate">Dup 1</div>
          <div path="/duplicate">Dup 2</div>
        </Switcher>,
        document.body
      );
    });

    afterEach(function() {
      React.unmountComponentAtNode(document.body);
    });

    it('gets component with matching path', function() {
      var swtch = this.switcher.getSwitch('/another');
      assert.equal(swtch.props.children, 'Another');
    });

    it('returns undefined if there is no matching switch', function() {
      var swtch = this.switcher.getSwitch('/notHere');
      assert.isUndefined(swtch);
    });

    it('gets first match if duplicate paths', function() {
      var swtch = this.switcher.getSwitch('/duplicate');
      assert.equal(swtch.props.children, 'Dup 1');
    });

    describe('with basepath set', function() {
      beforeEach(function() {
        this.switcher = React.render(
          <Switcher basePath="/base">
            <div path="/">Home</div>
            <div path="/another">Another</div>
            <div path="/duplicate">Dup 1</div>
            <div path="/duplicate">Dup 2</div>
          </Switcher>,
          document.body
        );
      });

      afterEach(function() {
        React.unmountComponentAtNode(document.body);
      });

      it('gets component with matching path', function() {
        var swtch = this.switcher.getSwitch('/base/another');
        assert.equal(swtch.props.children, 'Another');
      });
    });
  });

  describe('#handleRouteChange', function() {
    describe('default', function() {
      beforeEach(function() {
        this.switcher = React.render(
          <Switcher>
            <div path="/">Home</div>
          </Switcher>,
          document.body
        );
      });

      afterEach(function() {
        React.unmountComponentAtNode(document.body);
      });

      it('sets visibleSwitch state', function() {
        window.location.hash = '/';
        this.switcher.handleRouteChange();
        var visibleSwitch = this.switcher.state.visibleSwitch;
        assert.equal(visibleSwitch.props.children, 'Home');
        assert.equal(visibleSwitch.type, 'div');
      });
    });

    describe('with onChange function defined', function() {
      beforeEach(function() {
        this.handleChange = sinon.spy();
        this.switcher = React.render(
          <Switcher onChange={this.handleChange}>
            <div path="/">Home</div>
          </Switcher>,
          document.body
        );
      });

      afterEach(function() {
        React.unmountComponentAtNode(document.body);
      });

      it('calls onChange after path change', function() {
        this.switcher.handleRouteChange();
        assert(this.handleChange.called);
      });
    });
  });

  describe('#render', function() {
    describe('default', function() {
      beforeEach(function() {
        this.switcher = React.render(
          <Switcher>
            <div path="/">Home</div>
          </Switcher>,
          document.body
        );
      });

      afterEach(function() {
        React.unmountComponentAtNode(document.body);
      });

      it('renders nothing if no match', function() {
        window.location.hash = '/nomatch';
        this.switcher.handleRouteChange();
        var node = React.findDOMNode(this.switcher);
        assert.isNull(node);
      });

      it('renders matching component', function() {
        window.location.hash = '/';
        this.switcher.handleRouteChange();
        var node = React.findDOMNode(this.switcher);
        assert.equal(node.innerHTML, 'Home');
      });
    });

    describe('with default handler', function() {
      beforeEach(function() {
        var props = {text: 'Hello'};
        this.switcher = React.render(
          <Switcher
              defaultHandler={Handler}
              defaultHandlerProps={props}>
            <div path="/">Home</div>
          </Switcher>,
          document.body
        );
      });

      afterEach(function() {
        React.unmountComponentAtNode(document.body);
      });

      it('renders default handler when no match', function() {
        window.location.hash = '/nomatch';
        this.switcher.handleRouteChange();
        var node = React.findDOMNode(this.switcher);
        assert.equal(node.innerHTML, 'Hello');
      });

      it('renders matching component', function() {
        window.location.hash = '/';
        this.switcher.handleRouteChange();
        var node = React.findDOMNode(this.switcher);
        assert.equal(node.innerHTML, 'Home');
      });
    });

    describe('with wrapper', function() {
      beforeEach(function() {
        this.switcher = React.render(
          <Switcher wrapper="span">
            <div path="/">Home</div>
          </Switcher>,
          document.body
        );
      });

      afterEach(function() {
        React.unmountComponentAtNode(document.body);
      });

      it('renders just wrapper when no match', function() {
        window.location.hash = '/nomatch';
        this.switcher.handleRouteChange();
        var wrapper = React.findDOMNode(this.switcher);
        assert.equal(wrapper.innerHTML, '');
        assert.equal(wrapper.tagName, 'SPAN');
      });

      it('renders matched component in wrapper', function() {
        window.location.hash = '/';
        this.switcher.handleRouteChange();
        var wrapper = React.findDOMNode(this.switcher),
            component = wrapper.children[0];
        assert.equal(wrapper.tagName, 'SPAN');
        assert.equal(component.innerHTML, 'Home');
      });
    });
  });

});
