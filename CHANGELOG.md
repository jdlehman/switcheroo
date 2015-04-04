# Changelog

## 0.3.0 (2014-04-03)

Added:

- `Switcher` accepts optional `onChange` prop. This is a function that gets called when the route changes. [2f0c5d0](../../commit/2f0c5d0)
- `Switch` accepts optional `onShow`/`onHide` props. These are functions that get called when the `Switch` is rendered/removed from the view. [14aafea](../../commit/14aafea)
- `Switcher` accepts optional `defaultHandler`/`defaultHandlerProps` props. This is the default component that is rendered when there is not a matching `Switch` path. If one is not specified, nothing is rendered (a render function returning false). [97f956](../../commit/97f956)
- `Switch` accepts optional `handlerProps` prop. If defined this object is passed as props to the handler. [b9b7efc](../../commit/b9b7efc)

Fixed:

- `Switcher` component can now have less than two `Switch`s in it without erroring. [afe4e90](../../commit/afe4e90)

## 0.2.0 (2015-04-02)

- First working release!
