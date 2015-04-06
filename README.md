# Switcheroo

Switcheroo allows you to specify a React component that renders a specific component based on the URL. Looks at hash location by default (`window.location.hash`), but also supports [`pushState`](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history), which uses `window.location.pathname` for comparison.

The [`Switcher`](docs/components/Switcher.md) and [`Switch`](docs/components/Switch.md) components provided to you by switcheroo give you everything you need. Read the component docs for more information on configuring these components as well as the additional features/configuration hooks provided via optional props.

## Example

```js
import React, {Component} from 'react';
import {Switcher, Switch} from 'switcheroo';
// more component imports ...

class MyComponent extends Component {
  render() {
    return (
      <div>
        <Switcher>
          <Switch path="/" handler={DefaultHeader} />
          <Switch path="/login" handler={AccountHeader} />
          <Switch path="/store" handler={StoreHeader} />
        </Switcher>
        <Body />
        <Footer />
      </div>
    );
  }
}
```

You can use `pushState` by setting the `pushState` property on `Switcher` like `<Switcher pushState={true}>...`
