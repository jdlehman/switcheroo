[![npm version](https://badge.fury.io/js/switcheroo.svg)](http://badge.fury.io/js/switcheroo)
[![Build Status](https://secure.travis-ci.org/jdlehman/switcheroo.svg?branch=master)](http://travis-ci.org/jdlehman/switcheroo)
[![Dependency Status](https://david-dm.org/jdlehman/switcheroo.svg)](https://david-dm.org/jdlehman/switcheroo)

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

You can also use any React component in a `Switcher` as long as it has a `path` property specified.

```js
<Switcher>
  <HomeComponent path="/" />
  <AboutComponent path="/about" extraProp="thisOne" />
  <StoreComponent path="/store" handler={StoreHeader}>
    <ItemComponent />
  </StoreComponent>
</Switcher>
```
