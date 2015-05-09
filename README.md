[![npm version](https://badge.fury.io/js/switcheroo.svg)](http://badge.fury.io/js/switcheroo)
[![Build Status](https://secure.travis-ci.org/jdlehman/switcheroo.svg?branch=master)](http://travis-ci.org/jdlehman/switcheroo)
[![Dependency Status](https://david-dm.org/jdlehman/switcheroo.svg)](https://david-dm.org/jdlehman/switcheroo)

# switcheroo

switcheroo allows you to specify a React container component that renders a single child component based on a property of `window.location` (`hash`, `pathname`, etc.), using `window.location.hash` by default.

The `Switcher` container component provided by switcheroo can accept any React elements, as long as they have a `path` property. switcheroo is very configurable, and you can read about the properties the [`Switcher`](docs/components/Switcher.md) and children elements (that we will refer to as ["Switches"](docs/components/Switch.md)) take in the [docs](docs/components).

## Features

- Router agnostic. You can use any router, even [react-router](https://github.com/rackt/react-router), in conjunction with switcheroo
- Any React component can be used as a ["Switch"](docs/components/Switch.md) without any modification, other than defining a `path` property on it.
- Supports hashChange and pushState
- Provides callbacks including when a specific component [hides](docs/components/Switch.md#onhide) or [shows](docs/components/Switch.md#onshow) as well as when the path [changes](docs/components/Switcher.md#onchange)
- Supports [React animations](https://facebook.github.io/react/docs/animation.html) via [`wrapper`](docs/components/Switcher.md#wrapper) prop
- Highly configurable via props
- Lightweight ~4k gzipped

## Example

```js
<Switcher>
  <HomeComponent path="/" />
  <AboutComponent path="/about" someAboutComponentProp="thisOne" />
  <StoreComponent path="/store">
    <ItemComponent />
  </StoreComponent>
</Switcher>
```

## Rationale

The purpose of switcheroo is to enable switching what React component is rendered based on the configured part of the URL without forcing any routing opinions on you, you can use whatever router you wish. This helps keep switcheroo small and flexible.

If you are looking for a more robust and opinionated routing solution, I highly recommend taking a look at [react-router](https://github.com/rackt/react-router). This project actually spawned from an attempt to do something [similar](https://gist.github.com/jdlehman/b662cac8b8607abf51a6) with react-router.
