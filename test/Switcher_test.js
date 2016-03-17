import React from 'react';
import ReactDOM from 'react-dom';
import {assert} from 'chai';
import sinon from 'sinon';
import Switcher from 'index';

describe('Switcher', function() {
  describe('#handleRouteChange', function() {
    describe('default', function() {
      beforeEach(function() {
        this.switcher = ReactDOM.render(
          <Switcher>
            <div path="/">Home</div>
          </Switcher>,
          document.getElementById('app')
        );
      });

      afterEach(function() {
        ReactDOM.unmountComponentAtNode(document.getElementById('app'));
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
        this.switcher = ReactDOM.render(
          <Switcher onChange={this.handleChange}>
            <div path="/">Home</div>
            <div path="/:dynamic/more/:data">Dynamic</div>
          </Switcher>,
          document.getElementById('app')
        );
      });

      afterEach(function() {
        ReactDOM.unmountComponentAtNode(document.getElementById('app'));
      });

      it('calls onChange after path change', function() {
        this.switcher.handleRouteChange();
        sinon.assert.called(this.handleChange);
      });

      it('onChange handles paths with dynamic segments', function() {
        window.location.hash = '/hello/more/123a-b';
        this.switcher.handleRouteChange();
        sinon.assert.calledWith(this.handleChange,
          true,
          '/hello/more/123a-b',
          {
            dynamic: 'hello',
            data: '123a-b'
          }
        );
      });
    });
  });

  describe('#render', function() {
    describe('default', function() {
      beforeEach(function() {
        this.switcher = ReactDOM.render(
          <Switcher>
            <div path="/">Home</div>
          </Switcher>,
          document.getElementById('app')
        );
      });

      afterEach(function() {
        ReactDOM.unmountComponentAtNode(document.getElementById('app'));
      });

      it('renders nothing if no match', function() {
        window.location.hash = '/nomatch';
        this.switcher.handleRouteChange();
        var node = ReactDOM.findDOMNode(this.switcher);
        assert.isNull(node);
      });

      it('renders matching component', function() {
        window.location.hash = '/';
        this.switcher.handleRouteChange();
        var node = ReactDOM.findDOMNode(this.switcher);
        assert.equal(node.innerHTML, 'Home');
      });
    });

    describe('with default handler', function() {
      beforeEach(function() {
        this.switcher = ReactDOM.render(
          <Switcher>
            <div path="/home">Home</div>
            <div path="/.*">Default Handler</div>
          </Switcher>,
          document.getElementById('app')
        );
      });

      afterEach(function() {
        ReactDOM.unmountComponentAtNode(document.getElementById('app'));
      });

      it('renders default handler when no match', function() {
        window.location.hash = '/nomatch';
        this.switcher.handleRouteChange();
        var node = ReactDOM.findDOMNode(this.switcher);
        assert.equal(node.innerHTML, 'Default Handler');
      });

      it('default handle can match /', function() {
        window.location.hash = '/';
        this.switcher.handleRouteChange();
        var node = ReactDOM.findDOMNode(this.switcher);
        assert.equal(node.innerHTML, 'Default Handler');
      });

      it('renders matching component', function() {
        window.location.hash = '/home';
        this.switcher.handleRouteChange();
        var node = ReactDOM.findDOMNode(this.switcher);
        assert.equal(node.innerHTML, 'Home');
      });
    });

    describe('with wrapper', function() {
      beforeEach(function() {
        this.switcher = ReactDOM.render(
          <Switcher wrapper="span">
            <div path="/">Home</div>
          </Switcher>,
          document.getElementById('app')
        );
      });

      afterEach(function() {
        ReactDOM.unmountComponentAtNode(document.getElementById('app'));
      });

      it('renders just wrapper when no match', function() {
        window.location.hash = '/nomatch';
        this.switcher.handleRouteChange();
        var wrapper = ReactDOM.findDOMNode(this.switcher);
        assert.equal(wrapper.innerHTML, '');
        assert.equal(wrapper.tagName, 'SPAN');
      });

      it('renders matched component in wrapper', function() {
        window.location.hash = '/';
        this.switcher.handleRouteChange();
        var wrapper = ReactDOM.findDOMNode(this.switcher);
        var component = wrapper.children[0];
        assert.equal(wrapper.tagName, 'SPAN');
        assert.equal(component.innerHTML, 'Home');
      });
    });
  });
});
