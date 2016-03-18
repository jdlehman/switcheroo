# Switcher

The `Switcher` is a container component that holds a list of React components. It is the brains of `switcheroo`, and controls the handler that is rendered based on the path in the URL. `Switcher` allows any React component you want to be used as a ["Switch"](./Switch.md) as long as it has a `path` property. A path can have [dynamic segments](./dynamic_segments.md). The default path comparison uses `window.location.hash`, but can also use `window.location.pathname` by configuring the `location` prop.

```js
// using Switch components
// using any React component
<Switcher>
  <div path="/">Hello World</div>
  <AboutComponent path="/about" />
  <AnotherComponent path="/another" anotherProp={myProp} />
  <DefaultComponent path="/.*" />
</Switcher>
```


## Required Props

### children

To actually render anything, the `Switcher` must have any number of children elements. These children components must each have a `path` prop. The component with the matching path (if there is one) will be rendered. A path can have [dynamic segments](./dynamic_segments.md).


## Optional Props

### pushState (default: false)

When true, `Switcher` listens to the `popstate` event and looks for path changes on this event.

### hashChange  (default: true)

When true, `Switcher` listens to the `hashchange` event and looks for path changes on this event.

### load  (default: true)

When true, `Switcher` listens to the `load` event and looks for path changes on this event.

### location (default: 'hash')

By default `window.location.hash` is used to match paths. If `location` is set to 'pathname', then `window.location.pathname` is used instead. Under the hood, it is using `window.location[this.props.location]`, so you can use `search` or any other valid property on `window.location`.

### onChange

`onChange` enables a hook to call the provided function whenever the path changes. The function is provided 3 arguments, the first being a boolean of whether the path had a match, the second being the path as a string, and the third being the values of the matched [dynamic segments](./dynamic_segments) (`/:id`, etc).

```js
onChange(match, pathname, dynamicSegments) { ... }
```

### wrapper

If the `wrapper` prop is defined, the rendered child component will be wrapped in the specified React component. Any additional props passed to the `Switcher` will also be properties of this wrapper component.

### basePath (default: '')

`basePath` is prepended to all path properties in the components inside `Switcher`. If `basePath` is set to `/base/path` then a component with path, `/home` will match the path `/base/path/home`. The base path may also have [dynamic segments](./dynamic_segments.md). If `basePath` is set to `/base/:id/`, `/home` will match something like `/base/someIdCouldBeAnything/home`.

### preventUpdate (default: () => false)

`preventUpdate` is an optional function. When `preventUpdate` returns true, subsequent renders will not occur despite props changing or route changes. This can be useful when animating or doing something in which the presentation of the component is desired to remain static.

### mapDynamicSegments (default: data => data)

`mapDynamicSegments` is an optional function property. When there are [dynamic segments](./dynamic_segments.md) in a path, it passes an object with these values (where the key names are the segment names) to `mapDynamicSegments` and merges the object returned by `mapDynamicSegments` with the props. `mapDynamicSegments` can be used to transform the dynamic segment data before it is merged with props. By default the dynamic segment data object is passed through.
