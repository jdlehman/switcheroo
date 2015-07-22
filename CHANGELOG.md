# Changelog

## 0.7.0 (2015-07-22)

Fixed:

- Remove `setState` being called before component was mounted (removes warnings) [20c60de](../../commit/20c60de)

## 0.6.0 (2015-07-22)

Fixed:

- When a `Switch`'s `props` change ensure that the component is rendered with the correct data. This was previously using stale `props` from initialization as the `Switch`es are set to the handlers for `route-recognizer` route matches, so these references need to be updated on the React lifecycle, `componentWillReceiveProps`. [2f8316a](../../commit/2f8316a)

## 0.5.1 (2015-04-29)

Added:

- [`route-recognizer`](https://github.com/tildeio/route-recognizer) dependency added to handle matching paths. This allows for dynamic segments and star segments which are covered in the docs. [3d5da48](../../commit/3d5da48)

## 0.5.0 (2015-04-25)

Added:

- `Switcher` accepts optional `wrapper` prop. This specifies a component to wrap the rendered component with. [10dd2de](../../commit/10dd2de)
- `Switcher` now accepts `load` and `hashChange`. These both default to true and control the event listeners that `Switcher` checks for path changes on. These work in conjunction with the existing `pushState` prop. [1003c14](../../commit/1003c14)
- `Switcher` accepts `location` prop, that defaults to `hash`. This is used for path comparison (`window.location[this.props.location]`). [a91e604](../../commit/a91e604)
- `Switcher` accepts `basePath` prop that defaults to ''. This is prepended to all component path props in `Switcher`. [862f5fd](../../commit/862f5fd)

## 0.4.0 (2015-04-15)

Changed:

- `Switch` path now ignores query params. This means a `Switch` with a path `/abc` renders for `/abc` and `/abc?a=1&b=2`. [575bfb0](../../commit/575bfb0)

## 0.3.1 (2015-04-03)

Changed:

- `onChange` method is called right before `Switcher` renders new component. [0bbf93b](../../commit/0bbf93b)

## 0.3.0 (2015-04-03)

Added:

- `Switcher` accepts optional `onChange` prop. This is a function that gets called when the route changes. [2f0c5d0](../../commit/2f0c5d0)
- `Switch` accepts optional `onShow`/`onHide` props. These are functions that get called when the `Switch` is rendered/removed from the view. [14aafea](../../commit/14aafea)
- `Switcher` accepts optional `defaultHandler`/`defaultHandlerProps` props. This is the default component that is rendered when there is not a matching `Switch` path. If one is not specified, nothing is rendered (a render function returning false). [97f956](../../commit/97f956)
- `Switch` accepts optional `handlerProps` prop. If defined this object is passed as props to the handler. [b9b7efc](../../commit/b9b7efc)

Fixed:

- `Switcher` component can now have less than two `Switch`s in it without erroring. [afe4e90](../../commit/afe4e90)

## 0.2.0 (2015-04-02)

- First working release!
