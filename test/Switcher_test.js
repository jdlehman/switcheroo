import React from 'react';
import { render, cleanup, fireEvent } from 'react-testing-library';
import PropTypes from 'prop-types';
import Switcher from '../src';
import * as helpers from '../src/helpers';

const actualCurrentPath = helpers.currentPath;

afterEach(cleanup);
afterEach(() => {
  helpers.currentPath = actualCurrentPath;
});

describe('Switcher', () => {
  const ToBeSwitched = ({ children, ...others }) => (
    <div>
      <span data-testid="children">{children}</span>
      {Object.entries(others).map(([k, v]) => (
        <span key={k} data-testid={k}>
          {typeof v === 'object' ? JSON.stringify(v) : v}
        </span>
      ))}
    </div>
  );
  describe('#handleRouteChange', () => {
    describe('default', () => {
      let switcher;

      beforeEach(() => {
        switcher = renderComponent(<ToBeSwitched path="/">Home</ToBeSwitched>); // });
      });

      test('renders visibleSwitch with activePath', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/', params: {} }));
        fireEvent(window, new HashChangeEvent('hashchange'));

        const { queryByTestId } = switcher;
        expect(queryByTestId('children').textContent).toBe('Home');
        expect(queryByTestId('activePath').textContent).toBe('/');
      });
    });

    describe('with onChange function defined', () => {
      let handleChange;
      beforeEach(() => {
        handleChange = jest.fn();
        renderComponent(
          [
            <ToBeSwitched key="/" path="/">
              Home
            </ToBeSwitched>,
            <ToBeSwitched key="dynamic" path="/:dynamic/more/:data">
              Dynamic
            </ToBeSwitched>
          ],
          { onChange: handleChange }
        );
      });

      test('calls onChange after path change', () => {
        fireEvent(window, new HashChangeEvent('hashchange'));
        expect(handleChange).toHaveBeenCalledTimes(1);
      });

      test('onChange handles paths with dynamic segments', () => {
        helpers.currentPath = jest.fn(() => ({
          path: '/hello/more/123a-b',
          params: {}
        }));
        fireEvent(window, new HashChangeEvent('hashchange'));
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
        switcher = renderComponent(<ToBeSwitched path="/">Home</ToBeSwitched>);
      });

      test('renders nothing if no match', () => {
        helpers.currentPath = jest.fn(() => ({
          path: '/nomatch',
          params: {}
        }));

        fireEvent(window, new HashChangeEvent('hashchange'));
        expect(switcher.container.textContent).toEqual('');
      });

      test('renders matching component', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/', params: {} }));
        fireEvent(window, new HashChangeEvent('hashchange'));
        expect(switcher.container.textContent).toMatch(/Home/);
      });
    });

    describe('with multiple paths', () => {
      let switcher;
      beforeEach(() => {
        switcher = renderComponent(
          <ToBeSwitched path={['/', '/other']}>Home</ToBeSwitched>
        );
      });

      test('renders correct element', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/other', params: {} }));
        fireEvent(window, new HashChangeEvent('hashchange'));
        expect(switcher.container.textContent).toMatch(/Home/);
      });

      test('renders correct element', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/', params: {} }));
        fireEvent(window, new HashChangeEvent('hashchange'));
        expect(switcher.container.textContent).toMatch(/Home/);
      });

      test('renders correct elements', () => {
        helpers.currentPath = jest.fn(() => ({
          path: '/otherThing',
          params: {}
        }));
        fireEvent(window, new HashChangeEvent('hashchange'));
        expect(switcher.container.textContent).toBe('');
      });
    });

    describe('with default handler', () => {
      let switcher;
      beforeEach(() => {
        switcher = renderComponent([
          <ToBeSwitched key="home" path="/home">
            Home
          </ToBeSwitched>,
          <ToBeSwitched key="default" path="/.*">
            Default Handler
          </ToBeSwitched>
        ]);
      });

      test('renders default handler when no match', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/nomatch', params: {} }));
        fireEvent(window, new HashChangeEvent('hashchange'));
        expect(switcher.container.textContent).toMatch(/Default Handler/);
      });

      test('default handle can match /', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/', params: {} }));
        fireEvent(window, new HashChangeEvent('hashchange'));
        expect(switcher.container.textContent).toMatch(/Default Handler/);
      });

      test('renders matching component', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/home', params: {} }));
        fireEvent(window, new HashChangeEvent('hashchange'));
        expect(switcher.container.textContent).toMatch(/Home/);
      });
    });

    describe('with wrapper', () => {
      let switcher;
      beforeEach(() => {
        switcher = renderComponent(<ToBeSwitched path="/">Home</ToBeSwitched>, {
          wrapper: 'legend'
        });
      });

      test('renders just wrapper when no match', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/nomatch', params: {} }));
        fireEvent(window, new HashChangeEvent('hashchange'));
        expect(switcher.container.textContent).toEqual('');
        expect(switcher.container.querySelector('legend')).toBeEmpty();
      });

      test('renders matched component in wrapper', () => {
        helpers.currentPath = jest.fn(() => ({ path: '/', params: {} }));
        fireEvent(window, new HashChangeEvent('hashchange'));
        expect(switcher.container.querySelector('legend')).toHaveTextContent(
          'Home'
        );
      });
    });

    describe('with routes with dynamic segments', () => {
      let switcher;
      beforeEach(() => {
        switcher = renderComponent([
          <MyComp key="dynamic" path="/user/:id/information/:userNum" />,
          <ToBeSwitched key="static" path="/user/id/information/page">
            Static Content
          </ToBeSwitched>
        ]);
      });

      test('renders matched component and sets dynamic segments as props', () => {
        helpers.currentPath = jest.fn(() => ({
          path: '/user/123-abc/information/21',
          params: {}
        }));
        fireEvent(window, new HashChangeEvent('hashchange'));
        expect(switcher.container.querySelector('span')).toMatchInlineSnapshot(`
<span>
  {
  "path": "/user/:id/information/:userNum",
  "id": "123-abc",
  "userNum": "21",
  "activePath": "/user/:id/information/:userNum",
  "params": {}
}
</span>
`);
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

      test('renders matched component and sets dynamic segments as props', () => {
        helpers.currentPath = jest.fn(() => ({
          path: '/user/234-cde/information/421',
          params: {}
        }));
        fireEvent(window, new HashChangeEvent('hashchange'));
        expect(
          JSON.parse(switcher.container.querySelector('span').textContent)
        ).toEqual({
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
      test('calls the custom render function with the component and values', () => {
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

      test('renders matched component and sets dynamic segments as props', () => {
        helpers.currentPath = jest.fn(() => ({
          path: '/user/234-cde/information/421',
          params: { tab: 'blue' }
        }));
        fireEvent(window, new HashChangeEvent('hashchange'));
        expect(
          JSON.parse(switcher.container.querySelector('span').textContent)
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

  describe('prevent update prop', () => {
    test('can prevent changes', () => {
      let preventUpdate = () => false;
      const { getByText, rerender } = renderComponent(
        <ToBeSwitched path="/preventUpdate">
          <em>Hi</em>
        </ToBeSwitched>,
        { preventUpdate }
      );
      helpers.currentPath = jest.fn(() => ({
        path: '/preventUpdate',
        params: {}
      }));
      fireEvent(window, new HashChangeEvent('hashchange'));
      expect(getByText('Hi')).toBeInTheDocument();
      rerender(
        <ToBeSwitched path="/preventUpdate">
          <em>Hi</em>
        </ToBeSwitched>,
        { preventUpdate: () => true }
      );
      helpers.currentPath = jest.fn(() => ({
        path: '/someOtherPath',
        params: {}
      }));
      fireEvent(window, new HashChangeEvent('hashchange'));
      expect(getByText('Hi')).toBeInTheDocument();
    });
  });

  describe('getting new props', () => {
    test('rerenders children', () => {
      const { getByText, rerender } = renderComponent(
        <ToBeSwitched path="/">Home</ToBeSwitched>
      );

      rerender(<ToBeSwitched path="/">Away</ToBeSwitched>);
      expect(getByText('Away')).toBeInTheDocument();
    });
    test('calls the handler with correct props', () => {
      const onChange1 = jest.fn();
      const onChange2 = jest.fn();
      const { rerender } = renderComponent(
        <ToBeSwitched path="/">Home</ToBeSwitched>,
        {
          onChange: onChange1
        }
      );

      rerender(<ToBeSwitched path="/">Home</ToBeSwitched>, {
        onChange: onChange2
      });
      fireEvent(window, new HashChangeEvent('hashchange'));
      expect(onChange1).not.toHaveBeenCalled();
      expect(onChange2).toHaveBeenCalled();
    });
  });
});

function renderComponent(children = [], props = {}) {
  const { rerender, ...rendered } = render(
    <Switcher {...props}>{children}</Switcher>
  );
  return {
    ...rendered,
    rerender: (children = [], props = {}) => {
      return rerender(<Switcher {...props}>{children}</Switcher>);
    }
  };
}

function mapper({ id, page }) {
  const matches = id.match(/(.+)-(.+)/);
  return {
    userNum: matches[1],
    userLetters: matches[2],
    page: parseInt(page, 10) * 2
  };
}

function MyComp(props) {
  return <span>{JSON.stringify(props, null, 2)}</span>;
}
MyComp.displayName = 'MyComp';
MyComp.propTypes = {
  userNum: PropTypes.string,
  userLetters: PropTypes.string,
  page: PropTypes.number,
  activePath: PropTypes.string,
  params: PropTypes.object
};
