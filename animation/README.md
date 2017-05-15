# Animation Example

This example shows how to use the [`wrapper`](/docs/components/Switcher.md#wrapper) property to specify a component that will wrap any rendered content from the `Switcher`.

This can be as simple as wrapping with a div and adding a class:

```js
  <Switcher wrapper="div" className="my-styles">
    ...
  </Switcher>
```

Or the wrapper can be another React component. This allows us to easily get animations when components enter/leave with something like [velocity-react](https://github.com/twitter-fabric/velocity-react) or [ReactCSSTransitionGroup](https://facebook.github.io/react/docs/animation.html).

```js
<Switcher
  wrapper={VelocityTransitionGroup}
  enter={slideUpIn}
  leave={slideUpOut}>
  ...
</Switcher>
```

```js
<Switcher
  wrapper={ReactCSSTransitionGroup}
  transitionName="example"
  transitionEnterTimeout={300}
  transitionLeaveTimeout={300}>
  ...
</Switcher>
```

## Running locally

### Without server

- `open index.html`

### With server (to reflect any edits to code)

- `yarn`
- `yarn start`
- navigate to `http://localhost:8000`
