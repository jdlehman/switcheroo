# Changelog

## 0.13.0 (2015-10-20)

Changed:

- Removed optional `defaultHandler` and `defaultHandlerProps` properties. These are no longer necessary since regular expressions are now used for the `path` prop, meaning that the default component can be the last `Switch` with a `path` regular expression that matches everything. [38e843e](../../commit/38e843e)

Since this is a breaking change see how to migrate existing code that uses these props below:

```js
<Switcher defaultHandler={MyComponent} defaultHandlerProps={myComponentProps}>
  <Component1 path="/path1" />
  <Component2 path="/path2" />
</Switcher>
```

becomes

```js
<Switcher>
  <Component1 path="/path1" />
  <Component2 path="/path2" />
  <MyComponent path="/.*" {...myComponentProps} />
</Switcher>
```

## 0.12.0 (2015-10-18)

Changed:

- Removed external `window` from webpack build configuration. This requires less configuration from end users and the external was not providing any meaningful value. [fe53f76](../../commit/fe53f76)

## 0.11.0 (2015-10-08)

Changed:

- Upgraded to React 0.14.0. [81b5603](../../commit/81b5603)

## 0.10.0 (2015-10-04)

Fixed:

- Google Closure Compiler seems to break some things and gives this error when Switcheroo is used with webpack: `Super expression must either be null or a function, not undefined`. [52a3b4d](../../commit/52a3b4d)

## 0.9.1 (2015-10-04)

Changed:

- Reduced build size with Google Closure Compiler. [b72049b](../../commit/b72049b)

## 0.9.0 (2015-10-04)

Added:

- Allow `Switch` `path` property to take a string representing a regular expression or an array of them. [a55a73e](../../commit/a55a73e)

## 0.8.0 (2015-09-25)

Breaking Changes:

- Removed `route-recognizer` dependency. `path` prop now expects regular expression strings. eg: `<Component path="/myPath/valueA|valueB/.+" />. This means that paths with `route-recognizer` specific features like dynamic segments (`/path/:dynamic/more`) or star segments (`/path/*theRest`) will no longer work and should be updated. Most other paths should work without changes. [76df023](../../commit/76df023)

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
