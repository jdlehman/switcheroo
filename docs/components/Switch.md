# Switch

A "Switch" component is always used inside of the context of a `Switcher` component. It defines a path that the component will render on. We call the children of `Switcher` "Switches", but they can be any React component as long as they provide the `path` property.

```js
  <AboutComponent path="/about" />
```


## Required Props

### path

The `path` prop is a string or array of strings where each string represents a regular expression. If any of the regular expressions matches the path, the corresponding handler component will be rendered. If you define multiple `Switch`es with the same path, the first one will be used.
