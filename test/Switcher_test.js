import React from 'react';
import { shallow } from 'enzyme';
import PropTypes from 'prop-types';
import Switcher from '../src';
import * as helpers from '../src/helpers';

describe('Switcher', () => {
  describe('#handleRouteChange', () => {
    describe('default', () => {
      let switcher;
      beforeEach(() => {
        switcher = renderComponent(<div path="/">Home</div>);
        console.log(switcher.html());
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('sets visibleSwitch state', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/', params: {} }));
        switcher.instance().handleRouteChange();
        switcher.update();
        const visibleSwitch = switcher.state('visibleSwitch');
        expect(visibleSwitch.props.children).toEqual('Home');
        expect(visibleSwitch.type).toEqual('div');
      });

      it('sets activePath state', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/', params: {} }));
        switcher.instance().handleRouteChange();
        switcher.update();
        const activePath = switcher.state('activePath');
        expect(activePath).toEqual('/');
      });
    });

    describe('with onChange function defined', () => {
      let switcher;
      let handleChange;
      beforeEach(() => {
        handleChange = jest.fn();
        switcher = renderComponent(
          [
            <div key="/" path="/">
              Home
            </div>,
            <div key="dynamic" path="/:dynamic/more/:data">
              Dynamic
            </div>
          ],
          { onChange: handleChange }
        );
      });

      it('calls onChange after path change', () => {
        switcher.instance().handleRouteChange();
        switcher.update();
        expect(handleChange).toHaveBeenCalledTimes(1);
      });

      it('onChange handles paths with dynamic segments', () => {
        helpers.currentPath = jest.fn(() => ({
          path: '/hello/more/123a-b',
          params: {}
        }));
        switcher.instance().handleRouteChange();
        switcher.update();
        expect(handleChange).toHaveBeenCalledWith(
          true,
          '/hello/more/123a-b',
          {
            dynamic: 'hello',
            data: '123a-b'
          },
          '/:dynamic/more/:data',
          {}
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
        jest.restoreAllMocks();
      });

      it('renders nothing if no match', () => {
        helpers.currentPath = jest.fn(() => ({
          path: '/nomatch',
          params: {}
        }));
        switcher.instance().handleRouteChange();
        switcher.update();
        expect(switcher.text()).toEqual('');
      });

      it('renders matching component', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/', params: {} }));
        switcher.instance().handleRouteChange();
        switcher.update();
        expect(switcher.text()).toEqual('Home');
      });
    });

    describe('with multiple paths', () => {
      let switcher;
      beforeEach(() => {
        switcher = renderComponent(<div path={['/', '/other']}>Home</div>);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('renders correct element', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/other', params: {} }));
        switcher.instance().handleRouteChange();
        switcher.update();
        expect(switcher.text()).toEqual('Home');
      });

      it('renders correct element', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/', params: {} }));
        switcher.instance().handleRouteChange();
        switcher.update();
        expect(switcher.text()).toEqual('Home');
      });

      it('renders correct elements', () => {
        helpers.currentPath = jest.fn(() => ({
          path: '/otherThing',
          params: {}
        }));
        switcher.instance().handleRouteChange();
        switcher.update();
        expect(switcher.text()).toEqual('');
      });
    });

    describe('with default handler', () => {
      let switcher;
      beforeEach(() => {
        switcher = renderComponent([
          <div key="home" path="/home">
            Home
          </div>,
          <div key="default" path="/.*">
            Default Handler
          </div>
        ]);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('renders default handler when no match', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/nomatch', params: {} }));
        switcher.instance().handleRouteChange();
        switcher.update();
        expect(switcher.text()).toEqual('Default Handler');
      });

      it('default handle can match /', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/', params: {} }));
        switcher.instance().handleRouteChange();
        switcher.update();
        expect(switcher.text()).toEqual('Default Handler');
      });

      it('renders matching component', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/home', params: {} }));
        switcher.instance().handleRouteChange();
        switcher.update();
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
        jest.restoreAllMocks();
      });

      it('renders just wrapper when no match', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/nomatch', params: {} }));
        switcher.instance().handleRouteChange();
        switcher.update();
        expect(switcher.text()).toEqual('');
        expect(switcher.find('span').length).toEqual(1);
      });

      it('renders matched component in wrapper', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/', params: {} }));
        switcher.instance().handleRouteChange();
        switcher.update();
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
        jest.restoreAllMocks();
      });

      it('renders matched component and sets dynamic segments as props', () => {
        helpers.currentPath = jest.fn(() => ({
          path: '/user/123-abc/information/21',
          params: {}
        }));
        switcher.instance().handleRouteChange();
        switcher.update();
        expect(switcher.find('MyComp').length).toEqual(1);
        expect(switcher.props()).toEqual({
          id: '123-abc',
          path: '/user/:id/information/:userNum',
          userNum: '21',
          activePath: '/user/:id/information/:userNum',
          params: {}
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
            <div key="static" path="/user/id/information/page">
              Static Path
            </div>
          ],
          { mapDynamicSegments: mapper }
        );
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('renders matched component and sets dynamic segments as props', () => {
        helpers.currentPath = jest.fn(() => ({
          path: '/user/234-cde/information/421',
          params: {}
        }));
        switcher.instance().handleRouteChange();
        switcher.update();
        expect(switcher.find('MyComp').length).toEqual(1);
        expect(switcher.props()).toEqual({
          userNum: '234',
          userLetters: 'cde',
          path: '/user/:id/information/:page',
          page: 842,
          activePath: '/user/:id/information/:page',
          params: {}
        });
      });
    });

    describe('with custom render', () => {
      it('calls the custom render function with the component and values', () => {
        helpers.currentPath = jest.fn(() => ({
          path: '/user/234-cde/information/421',
          params: { tab: 'green' }
        }));
        function mapper({ id, page }) {
          const matches = id.match(/(.+)-(.+)/);
          return {
            userNum: matches[1],
            userLetters: matches[2],
            page: parseInt(page, 10) * 2
          };
        }
        function MyComp(props) {
          return (
            <span>
              {props.userNum +
                props.userLetters +
                props.page +
                props.params.tab}
            </span>
          );
        }
        MyComp.displayName = 'MyComp';
        MyComp.propTypes = {
          userNum: PropTypes.string,
          userLetters: PropTypes.string,
          page: PropTypes.number,
          params: PropTypes.object
        };
        const render = jest.fn(arg => arg);
        renderComponent(
          [
            <MyComp key="dynamic" path="/user/:id/information/:page" />,
            <div key="static" path="/user/id/information/page">
              Static Path
            </div>
          ],
          { renderSwitch: render, mapDynamicSegments: mapper }
        );
        expect(render).toHaveBeenCalledTimes(1);
        expect(render.mock.calls[0][1]).toEqual({ id: '234-cde', page: '421' });
        expect(render.mock.calls[0][2]).toEqual('/user/:id/information/:page');
        expect(render.mock.calls[0][3]).toEqual({ tab: 'green' });
      });
      afterEach(() => {
        jest.restoreAllMocks();
      });
    });

    describe('with a wrapper', () => {
      let switcher;
      beforeEach(() => {
        switcher = renderComponent(
          [
            <MyComp key="dynamic" path="/user/:id/information/:page" />,
            <div key="static" path="/user/id/information/page">
              Static Path
            </div>
          ],
          { wrapper: 'div', mapDynamicSegments: mapper }
        );
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('renders matched component and sets dynamic segments as props', () => {
        helpers.currentPath = jest.fn(() => ({
          path: '/user/234-cde/information/421',
          params: { tab: 'blue' }
        }));
        switcher.instance().handleRouteChange();
        switcher.update();
        expect(switcher.find('MyComp').length).toEqual(1);
        expect(
          switcher
            .children()
            .first()
            .props()
        ).toEqual({
          userNum: '234',
          userLetters: 'cde',
          path: '/user/:id/information/:page',
          page: 842,
          activePath: '/user/:id/information/:page',
          params: { tab: 'blue' }
        });
      });
    });
  });
});

function renderComponent(children = [], props = {}) {
  return shallow(<Switcher {...props}>{children}</Switcher>);
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
  return <span>{userNum + userLetters + page + activePath}</span>;
}
MyComp.displayName = 'MyComp';
MyComp.propTypes = {
  userNum: PropTypes.string,
  userLetters: PropTypes.string,
  page: PropTypes.number,
  activePath: PropTypes.string,
  params: PropTypes.object
};
