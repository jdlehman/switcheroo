import React from 'react';
import { shallow } from 'enzyme';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import Switcher from '../src';
import * as helpers from '../src/helpers';

describe('Switcher', () => {
  describe('#handleRouteChange', () => {
    describe('default', () => {
      let switcher;
      beforeEach(() => {
        switcher = renderComponent(<div path="/">Home</div>);
      });

      afterEach(() => {
        helpers.currentPath.restore();
      });

      it('sets visibleSwitch state', () => {
        sinon.stub(helpers, 'currentPath').returns('/');
        switcher.instance().handleRouteChange();
        const visibleSwitch = switcher.state('visibleSwitch');
        expect(visibleSwitch.props.children).toEqual('Home');
        expect(visibleSwitch.type).toEqual('div');
      });

      it('sets activePath state', () => {
        sinon.stub(helpers, 'currentPath').returns('/');
        switcher.instance().handleRouteChange();
        const activePath = switcher.state('activePath');
        expect(activePath).toEqual('/');
      });
    });

    describe('with onChange function defined', () => {
      let switcher;
      let handleChange;
      beforeEach(() => {
        handleChange = sinon.spy();
        switcher = renderComponent(
          [
            <div key="/" path="/">Home</div>,
            <div key="dynamic" path="/:dynamic/more/:data">Dynamic</div>
          ],
          { onChange: handleChange }
        );
      });

      it('calls onChange after path change', () => {
        switcher.instance().handleRouteChange();
        sinon.assert.called(handleChange);
      });

      it('onChange handles paths with dynamic segments', () => {
        sinon.stub(helpers, 'currentPath').returns('/hello/more/123a-b');
        switcher.instance().handleRouteChange();
        helpers.currentPath.restore();
        sinon.assert.calledWith(
          handleChange,
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

  describe('#render', () => {
    describe('default', () => {
      let switcher;
      beforeEach(() => {
        switcher = renderComponent(<div path="/">Home</div>);
      });

      afterEach(() => {
        helpers.currentPath.restore();
      });

      it('renders nothing if no match', () => {
        sinon.stub(helpers, 'currentPath').returns('/nomatch');
        switcher.instance().handleRouteChange();
        expect(switcher.text()).toEqual('');
      });

      it('renders matching component', () => {
        sinon.stub(helpers, 'currentPath').returns('/');
        switcher.instance().handleRouteChange();
        expect(switcher.text()).toEqual('Home');
      });
    });

    describe('with multiple paths', () => {
      let switcher;
      beforeEach(() => {
        switcher = renderComponent(<div path={['/', '/other']}>Home</div>);
      });

      afterEach(() => {
        helpers.currentPath.restore();
      });

      it('renders correct element', () => {
        sinon.stub(helpers, 'currentPath').returns('/other');
        switcher.instance().handleRouteChange();
        expect(switcher.text()).toEqual('Home');
      });

      it('renders correct element', () => {
        sinon.stub(helpers, 'currentPath').returns('/');
        switcher.instance().handleRouteChange();
        expect(switcher.text()).toEqual('Home');
      });

      it('renders correct elements', () => {
        sinon.stub(helpers, 'currentPath').returns('/otherThing');
        switcher.instance().handleRouteChange();
        expect(switcher.text()).toEqual('');
      });
    });

    describe('with default handler', () => {
      let switcher;
      beforeEach(() => {
        switcher = renderComponent([
          <div key="home" path="/home">Home</div>,
          <div key="default" path="/.*">Default Handler</div>
        ]);
      });

      afterEach(() => {
        helpers.currentPath.restore();
      });

      it('renders default handler when no match', () => {
        sinon.stub(helpers, 'currentPath').returns('/nomatch');
        switcher.instance().handleRouteChange();
        expect(switcher.text()).toEqual('Default Handler');
      });

      it('default handle can match /', () => {
        sinon.stub(helpers, 'currentPath').returns('/');
        switcher.instance().handleRouteChange();
        expect(switcher.text()).toEqual('Default Handler');
      });

      it('renders matching component', () => {
        sinon.stub(helpers, 'currentPath').returns('/home');
        switcher.instance().handleRouteChange();
        expect(switcher.text()).toEqual('Home');
      });
    });

    describe('with wrapper', () => {
      let switcher;
      beforeEach(() => {
        switcher = renderComponent(<div path="/">Home</div>, {
          wrapper: 'span'
        });
      });

      afterEach(() => {
        helpers.currentPath.restore();
      });

      it('renders just wrapper when no match', () => {
        sinon.stub(helpers, 'currentPath').returns('/nomatch');
        switcher.instance().handleRouteChange();
        expect(switcher.text()).toEqual('');
        expect(switcher.find('span').length).toEqual(1);
      });

      it('renders matched component in wrapper', () => {
        sinon.stub(helpers, 'currentPath').returns('/');
        switcher.instance().handleRouteChange();
        expect(switcher.text()).toEqual('Home');
        expect(switcher.find('span').length).toEqual(1);
      });
    });

    describe('with routes with dynamic segments', () => {
      let switcher;
      beforeEach(() => {
        switcher = renderComponent([
          <MyComp key="dynamic" path="/user/:id/information/:userNum" />,
          <span key="static" path="/user/id/information/page">
            Static Content
          </span>
        ]);
      });

      afterEach(() => {
        helpers.currentPath.restore();
      });

      it('renders matched component and sets dynamic segments as props', () => {
        sinon
          .stub(helpers, 'currentPath')
          .returns('/user/123-abc/information/21');
        switcher.instance().handleRouteChange();
        expect(switcher.find('MyComp').length).toEqual(1);
        expect(switcher.props()).toEqual({
          id: '123-abc',
          path: '/user/:id/information/:userNum',
          userNum: '21',
          activePath: '/user/:id/information/:userNum'
        });
      });
    });
  });

  describe('mapDynamicSegments', () => {
    describe('without a wrapper', () => {
      let switcher;
      beforeEach(() => {
        switcher = renderComponent(
          [
            <MyComp key="dynamic" path="/user/:id/information/:page" />,
            <div key="static" path="/user/id/information/page">Static Path</div>
          ],
          { mapDynamicSegments: mapper }
        );
      });

      afterEach(() => {
        helpers.currentPath.restore();
      });

      it('renders matched component and sets dynamic segments as props', () => {
        sinon
          .stub(helpers, 'currentPath')
          .returns('/user/234-cde/information/421');
        switcher.instance().handleRouteChange();
        expect(switcher.find('MyComp').length).toEqual(1);
        expect(switcher.props()).toEqual({
          userNum: '234',
          userLetters: 'cde',
          path: '/user/:id/information/:page',
          page: 842,
          activePath: '/user/:id/information/:page'
        });
      });
    });

    describe('with custom render', () => {
      it('calls the custom render function with the component and values', () => {
        sinon
          .stub(helpers, 'currentPath')
          .returns('/user/234-cde/information/421');
        function mapper({ id, page }) {
          const matches = id.match(/(.+)-(.+)/);
          return {
            userNum: matches[1],
            userLetters: matches[2],
            page: parseInt(page, 10) * 2
          };
        }
        function MyComp(props) {
          return <span>{props.userNum + props.userLetters + props.page}</span>;
        }
        MyComp.displayName = 'MyComp';
        MyComp.propTypes = {
          userNum: PropTypes.string,
          userLetters: PropTypes.string,
          page: PropTypes.number
        };
        const render = sinon.stub().returnsArg(0);
        renderComponent(
          [
            <MyComp key="dynamic" path="/user/:id/information/:page" />,
            <div key="static" path="/user/id/information/page">Static Path</div>
          ],
          { renderSwitch: render, mapDynamicSegments: mapper }
        );
        sinon.assert.calledOnce(render);
        expect(render.args[0][1]).toEqual({ id: '234-cde', page: '421' });
        expect(render.args[0][2]).toEqual('/user/:id/information/:page');
      });
      afterEach(() => {
        helpers.currentPath.restore();
      });
    });

    describe('with a wrapper', () => {
      let switcher;
      beforeEach(() => {
        switcher = renderComponent(
          [
            <MyComp key="dynamic" path="/user/:id/information/:page" />,
            <div key="static" path="/user/id/information/page">Static Path</div>
          ],
          { wrapper: 'div', mapDynamicSegments: mapper }
        );
      });

      afterEach(() => {
        helpers.currentPath.restore();
      });

      it('renders matched component and sets dynamic segments as props', () => {
        sinon
          .stub(helpers, 'currentPath')
          .returns('/user/234-cde/information/421');
        switcher.instance().handleRouteChange();
        expect(switcher.find('MyComp').length).toEqual(1);
        expect(switcher.children().first().props()).toEqual({
          userNum: '234',
          userLetters: 'cde',
          path: '/user/:id/information/:page',
          page: 842,
          activePath: '/user/:id/information/:page'
        });
      });
    });
  });
});

function renderComponent(children = [], props = {}) {
  return shallow(
    <Switcher {...props}>
      {children}
    </Switcher>
  );
}

function mapper({ id, page }) {
  const matches = id.match(/(.+)-(.+)/);
  return {
    userNum: matches[1],
    userLetters: matches[2],
    page: parseInt(page, 10) * 2
  };
}

function MyComp({ userNum, userLetters, page, activePath }) {
  return (
    <span>
      {userNum + userLetters + page + activePath}
    </span>
  );
}
MyComp.displayName = 'MyComp';
MyComp.propTypes = {
  userNum: PropTypes.string,
  userLetters: PropTypes.string,
  page: PropTypes.number,
  activePath: PropTypes.string
};
