# Switch

A "Switch" component is always used inside of the context of a `Switcher` component. It defines a path that the component will render on. We call the children of `Switcher` "Switches", but they can be any React component as long as they provide the `path` property.

```js
  <AboutComponent path="/about" />
```


## Required Props

### path

The `path` prop is a string that if matches the path, the corresponding handler component will be rendered. If you define multiple `Switch`es with the same path, the last one will be used. switcheroo makes use of [`route-recognizer`](https://github.com/tildeio/route-recognizer) to match paths with the URL, meaning that dynamic segments and star segments will work.

```js
// dynamic segments
"/post/:id" matches "/post/1", "/post/100", and "/post/whatever", but not "/post"

// star segements
"/post/*everything" matches "/post/one", "post/one/two", and "/post/one/two/three", but not "/post"
```
