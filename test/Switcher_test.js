import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {assert} from 'chai';
import sinon from 'sinon';
import Switcher from 'index';
import * as helpers from 'helpers';

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
        helpers.currentPath.restore();
      });

      it('sets visibleSwitch state', function() {
        sinon.stub(helpers, 'currentPath').returns('/');
        this.switcher.handleRouteChange();
        var visibleSwitch = this.switcher.state.visibleSwitch;
        assert.equal(visibleSwitch.props.children, 'Home');
        assert.equal(visibleSwitch.type, 'div');
      });

      it('sets activePath state', function() {
        sinon.stub(helpers, 'currentPath').returns('/');
        this.switcher.handleRouteChange();
        var activePath = this.switcher.state.activePath;
        assert.equal(activePath, '/');
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
        sinon.stub(helpers, 'currentPath').returns('/hello/more/123a-b');
        this.switcher.handleRouteChange();
        helpers.currentPath.restore();
        sinon.assert.calledWith(this.handleChange,
          true,
          '/hello/more/123a-b',
          {
            dynamic: 'hello',
            data: '123a-b'
          },
          '/:dynamic/more/:data'
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
        helpers.currentPath.restore();
      });

      it('renders nothing if no match', function() {
        sinon.stub(helpers, 'currentPath').returns('/nomatch');
        this.switcher.handleRouteChange();
        var node = ReactDOM.findDOMNode(this.switcher);
        assert.isNull(node);
      });

      it('renders matching component', function() {
        sinon.stub(helpers, 'currentPath').returns('/');
        this.switcher.handleRouteChange();
        var node = ReactDOM.findDOMNode(this.switcher);
        assert.equal(node.innerHTML, 'Home');
      });
    });

    describe('with multiple paths', function() {
      beforeEach(function() {
        this.switcher = ReactDOM.render(
          <Switcher>
            <div path={['/', '/other']}>Home</div>
          </Switcher>,
          document.getElementById('app')
        );
      });

      afterEach(function() {
        ReactDOM.unmountComponentAtNode(document.getElementById('app'));
        helpers.currentPath.restore();
      });

      it('renders correct element', function() {
        sinon.stub(helpers, 'currentPath').returns('/other');
        this.switcher.handleRouteChange();
        var node = ReactDOM.findDOMNode(this.switcher);
        assert.equal(node.innerHTML, 'Home');
      });

      it('renders correct element', function() {
        sinon.stub(helpers, 'currentPath').returns('/');
        this.switcher.handleRouteChange();
        var node = ReactDOM.findDOMNode(this.switcher);
        assert.equal(node.innerHTML, 'Home');
      });

      it('renders correct elements', function() {
        sinon.stub(helpers, 'currentPath').returns('/otherThing');
        this.switcher.handleRouteChange();
        var node = ReactDOM.findDOMNode(this.switcher);
        assert.equal(node, null);
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
        helpers.currentPath.restore();
      });

      it('renders default handler when no match', function() {
        sinon.stub(helpers, 'currentPath').returns('/nomatch');
        this.switcher.handleRouteChange();
        var node = ReactDOM.findDOMNode(this.switcher);
        assert.equal(node.innerHTML, 'Default Handler');
      });

      it('default handle can match /', function() {
        sinon.stub(helpers, 'currentPath').returns('/');
        this.switcher.handleRouteChange();
        var node = ReactDOM.findDOMNode(this.switcher);
        assert.equal(node.innerHTML, 'Default Handler');
      });

      it('renders matching component', function() {
        sinon.stub(helpers, 'currentPath').returns('/home');
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
        helpers.currentPath.restore();
      });

      it('renders just wrapper when no match', function() {
        sinon.stub(helpers, 'currentPath').returns('/nomatch');
        this.switcher.handleRouteChange();
        var wrapper = ReactDOM.findDOMNode(this.switcher);
        assert.equal(wrapper.innerHTML, '');
        assert.equal(wrapper.tagName, 'SPAN');
      });

      it('renders matched component in wrapper', function() {
        sinon.stub(helpers, 'currentPath').returns('/');
        this.switcher.handleRouteChange();
        var wrapper = ReactDOM.findDOMNode(this.switcher);
        var component = wrapper.children[0];
        assert.equal(wrapper.tagName, 'SPAN');
        assert.equal(component.innerHTML, 'Home');
      });
    });

    describe('with routes with dynamic segments', function() {
      beforeEach(function() {
        function MyComp(props) {
          return (
            <span>{props.id + props.page}</span>
          );
        }
        MyComp.displayName = 'MyComp';
        MyComp.propTypes = {
          id: PropTypes.string,
          page: PropTypes.string
        };
        this.switcher = ReactDOM.render(
          <Switcher>
            <MyComp path="/user/:id/information/:page" />
            <span path="/user/id/information/page">Static Content</span>
          </Switcher>,
          document.getElementById('app')
        );
      });

      afterEach(function() {
        ReactDOM.unmountComponentAtNode(document.getElementById('app'));
        helpers.currentPath.restore();
      });

      it('renders matched component and sets dynamic segments as props', function() {
        sinon.stub(helpers, 'currentPath').returns('/user/123-abc/information/21');
        this.switcher.handleRouteChange();
        var component = ReactDOM.findDOMNode(this.switcher);
        assert.equal(component.innerHTML, '123-abc21');
      });
    });
  });

  describe('mapDynamicSegments', function() {
    describe('without a wrapper', function() {
      beforeEach(function() {
        function mapper({id, page}) {
          var matches = id.match(/(.+)-(.+)/);
          return {
            userNum: matches[1],
            userLetters: matches[2],
            page: parseInt(page, 10) * 2
          };
        }
        function MyComp(props) {
          return (
            <span>{props.userNum + props.userLetters + props.page + props.activePath}</span>
          );
        }
        MyComp.displayName = 'MyComp';
        MyComp.propTypes = {
          userNum: PropTypes.string,
          userLetters: PropTypes.string,
          page: PropTypes.number
        };
        this.switcher = ReactDOM.render(
          <Switcher mapDynamicSegments={mapper}>
            <MyComp path="/user/:id/information/:page" />
            <div path="/user/id/information/page">Static Path</div>
          </Switcher>,
          document.getElementById('app')
        );
      });

      afterEach(function() {
        ReactDOM.unmountComponentAtNode(document.getElementById('app'));
        helpers.currentPath.restore();
      });

      it('renders matched component and sets dynamic segments as props', function() {
        sinon.stub(helpers, 'currentPath').returns('/user/234-cde/information/421');
        this.switcher.handleRouteChange();
        var component = ReactDOM.findDOMNode(this.switcher);
        assert.equal(component.innerHTML, '234cde842/user/:id/information/:page');
      });
    });

    describe('with custom render', function() {
      it('calls the custom render function with the component and values', function() {
        sinon.stub(helpers, 'currentPath').returns('/user/234-cde/information/421');
        function mapper({id, page}) {
          var matches = id.match(/(.+)-(.+)/);
          return {
            userNum: matches[1],
            userLetters: matches[2],
            page: parseInt(page, 10) * 2
          };
        }
        function MyComp(props) {
          return (
            <span>{props.userNum + props.userLetters + props.page}</span>
          );
        }
        MyComp.displayName = 'MyComp';
        MyComp.propTypes = {
          userNum: PropTypes.string,
          userLetters: PropTypes.string,
          page: PropTypes.number
        };
        const render = sinon.stub().returnsArg(0);
        ReactDOM.render(
          <Switcher renderSwitch={render} mapDynamicSegments={mapper}>
            <MyComp path="/user/:id/information/:page" />
            <div path="/user/id/information/page">Static Path</div>
          </Switcher>,
          document.getElementById('app')
        );
        sinon.assert.calledOnce(render);
        assert.deepEqual(render.args[0][1], {id: '234-cde', page: '421'});
        assert.deepEqual(render.args[0][2], '/user/:id/information/:page');
      });
      afterEach(function() {
        ReactDOM.unmountComponentAtNode(document.getElementById('app'));
        helpers.currentPath.restore();
      });
    });

    describe('with a wrapper', function() {
      beforeEach(function() {
        function mapper({id, page}) {
          var matches = id.match(/(.+)-(.+)/);
          return {
            userNum: matches[1],
            userLetters: matches[2],
            page: parseInt(page, 10) * 2
          };
        }
        function MyComp(props) {
          return (
            <span>{props.userNum + props.userLetters + props.page + props.activePath}</span>
          );
        }
        MyComp.displayName = 'MyComp';
        MyComp.propTypes = {
          userNum: PropTypes.string,
          userLetters: PropTypes.string,
          page: PropTypes.number,
          activePath: PropTypes.string
        };
        this.switcher = ReactDOM.render(
          <Switcher wrapper="div" mapDynamicSegments={mapper}>
            <MyComp path="/user/:id/information/:page" />
            <div path="/user/id/information/page">Static Path</div>
          </Switcher>,
          document.getElementById('app')
        );
      });

      afterEach(function() {
        ReactDOM.unmountComponentAtNode(document.getElementById('app'));
        helpers.currentPath.restore();
      });

      it('renders matched component and sets dynamic segments as props', function() {
        sinon.stub(helpers, 'currentPath').returns('/user/234-cde/information/421');
        this.switcher.handleRouteChange();
        var wrapper = ReactDOM.findDOMNode(this.switcher);
        var component = wrapper.children[0];
        assert.equal(component.innerHTML, '234cde842/user/:id/information/:page');
      });
    });
  });
});
