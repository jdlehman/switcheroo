# Switch

The `Switch` component is always used inside of the context of a `Switcher` component. It defines a path as well as a handler that will be rendered if the path matches.

Though `Switch` is provided and will be covered in the docs, you can also extend the `Switch` component or define your own component that conforms to the same interface to customize behavior.

```js
  <Switch path="/about" handler={AboutComponent} />
```


## Required Props

### path

The `path` prop is a string that if matches the path, the corresponding handler component will be rendered. If you define multiple `Switch`es with the same path, the first one will be used.

### handler

The `handler` prop is the React component to be rendered on a matching path.


## Optional Props

### handlerProps

`handlerProps` is passed directly as props to the `handler`.

### onShow

`onShow` is a function that gets called whenever a particular `Switch` is used (meaning its path prop matched the path). This function does not receive any arguments.

### onHide

`onHide` is a function that gets called whenever a matching `Switch` is no longer matching anymore, and therefore no longer rendered. This function does not receive any arguments.
