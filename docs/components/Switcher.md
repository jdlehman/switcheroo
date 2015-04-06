# Switcher

The `Switcher` is a container component that holds `Switch` components. It is the brains of switcheroo, and controls the handler that is rendered based on the path in the URL. The default path comparison uses `window.location.hash`, but can also use `window.location.pathname` if the optional `pushState` prop is set to true (see below).

```js
<Switcher>
  <Switch path="/" handler={ComponentOne} />
  <Switch path="/about" handler={ComponentTwo} />
  <Switch path="/another" handler={ComponentThree} />
</Switcher>
```


## Required Props

### children

To actually render anything, the `Switcher` must have any number of `Switch` children elements. The `Switch` with the matching path (if there is one) will be rendered.


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
