# Dynamic Segments

Like many routing solutions, Rails, express, etc. `switcheroo` supports paths with dynamic segments. These are essentially dynamic parts of the route that will match anything. While the `path` property on a `"Switch"`(./Switch.md) takes a regular expression string, it is beneficial to use dynamic segments because it provides `switcheroo` with named data that can be used elsewhere like in the [`onChange`](./Switcher.md#onchange) callback. These dynamic segments also get passed into the component as props. The data can be transformed by [`mapDynamicSegments`](./Switcher.md#mapdynamicsegments) function property being set as props.

## Examples

The path `/path/:id/more` has a dynamic segment named `id`. It can match any of the following:
- `/path/hello/more`
- `/path/somethingElse/more`
- `/path/hello-world/more`

It would **not** match:
- `/path/abc/more/tooMuch`
- `/path/more`

