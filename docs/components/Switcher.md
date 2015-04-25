# Switcher

The `Switcher` is a container component that holds a list of React components. It is the brains of switcheroo, and controls the handler that is rendered based on the path in the URL. switcheroo provides a [`Switch`](./Switch.md) component that you may use for the items in the `Switcher`, but you may also use any React component you want as long as it has a `path` property. The default path comparison uses `window.location.hash`, but can also use `window.location.pathname` if the optional `pushState` prop is set to true (see below).

```js
// using Switch components
<Switcher>
  <Switch path="/" handler={ComponentOne} />
  <Switch path="/about" handler={ComponentTwo} />
  <Switch path="/another" handler={ComponentThree} />
</Switcher>

// using any React component
<Switcher>
  <div path="/">Hello World</div>
  <AboutComponent path="/about" />
  <AnotherComponent path="/another" anotherProp={myProp} />
</Switcher>
```


## Required Props

### children

To actually render anything, the `Switcher` must have any number of children elements. These children must be [`Switch`](./Switch.md) components or have a `path` prop. The component with the matching path (if there is one) will be rendered.


## Optional Props

### pushState

By default `window.location.hash` is used to match paths. If the `pushState` prop is set to true, then `window.location.pathname` is used.

When the hash is used, `Switcher` listens for path changes with the `hashchange` event, and when `pushState` is used, it listens to the `popstate` event.

### defaultHandler

The `defaultHandler` is the handler that is used when there are no `Switch` elements with matching paths. If a default handler is not provided by the user, the component will render nothing when there isn't a match.

### defaultHandlerProps

`defaultHandlerProps` is passed directly as props to the `defaultHandler`.

### onChange

`onChange` enables a hook to call the provided function whenever the path changes. The function is provided 2 arguments, the first being a boolean of whether the path had a match, and the second being the path as a string.

```js
onChange(match, pathname) { ... }
```

### wrapper

If the `wrapper` prop is defined, the rendered `Switch` will be wrapped in the specified React component. Any additional props passed to the `Switcher` will also be properties of this component.
