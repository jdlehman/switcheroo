[![npm version](https://badge.fury.io/js/switcheroo.svg)](http://badge.fury.io/js/switcheroo)
[![Build Status](https://secure.travis-ci.org/jdlehman/switcheroo.svg?branch=master)](http://travis-ci.org/jdlehman/switcheroo)
[![Dependency Status](https://david-dm.org/jdlehman/switcheroo.svg)](https://david-dm.org/jdlehman/switcheroo)
[![Greenkeeper badge](https://badges.greenkeeper.io/jdlehman/switcheroo.svg)](https://greenkeeper.io/)

# switcheroo

`switcheroo` allows you to specify a React container component that renders a single child component based on a property of `window.location` (`hash`, `pathname`, etc.), using `window.location.hash` by default.

The `Switcher` container component provided by `switcheroo` can accept any React elements, as long as they have a `path` property. `switcheroo` is very configurable, and you can read about the properties the [`Switcher`](docs/Switcher.md) and children elements (that we will refer to as ["Switches"](docs/Switch.md)) take in the [docs](docs/). A higher order component to help improve `Switcher` performance in larger applications is also provided, [`SwitcherProvider`](docs/SwitcherProvider.md).

## Installation

### npm

```sh
npm install --save switcheroo
```

### cdn

While the `npm` package is recommended for production usage, if you just want to drop a `<script>` tag on your page you can also use the UMD/global build hosted on [`unpkg`](https://unpkg.com/switcheroo).

```html
<script src="https://unpkg.com/switcheroo"></script>
```

## Try it out

You can try out `switcheroo` now on [jsbin](https://jsbin.com/qusomol/edit?js,output). Or see it in action powering Custom Ink's [design lab](https://www.customink.com/ndx/).

## Features

- Router agnostic. You can use any router, even [react-router](https://github.com/rackt/react-router), in conjunction with `switcheroo`
- Any React component can be used as a ["Switch"](docs/Switch.md) without any modification, other than defining a `path` property on it.
- Supports hashChange and pushState
- Provides callbacks including when the path [changes](docs/Switcher.md#onchange)
- Supports [dynamic path segments](docs/dynamic_segments.md) and passes dynamic segment data to "Switch" component as props.
- Passes query parameters to "Switch" component as props.
- Supports [React animations](https://facebook.github.io/react/docs/animation.html) via [`wrapper`](docs/Switcher.md#wrapper) prop
- Highly configurable via props
- Lightweight ~2k gzipped

## Example Usage

```js
import Switcher from 'switcheroo';

<Switcher>
  <HomeComponent path="/" />
  <AboutComponent path="/about" someAboutComponentProp="thisOne" />
  <StoreComponent path="/store">
    <ItemComponent />
  </StoreComponent>
  <UserComponent path="/user/:id" />
</Switcher>
```

## Transitions and Animations

You can use the `wrapper` property with transition group elements like React's [CSSTransitionGroup](https://facebook.github.io/react/docs/animation.html) addon or Twitter Fabric's [velocity-react](https://github.com/twitter-fabric/velocity-react) to make `Switch` elements animate as they enter and leave.

See the [animation example](examples/animation) to see animations in action.
- `velocity-react` [usage](examples/animation/components/Overlay.js#L35)
- `CSSTransitionGroup` [usage](examples/animation/components/LeftContent.js#L18)

## Rationale

The purpose of `switcheroo` is to enable switching what React component is rendered based on the configured part of the URL without forcing any routing opinions on you, you can use whatever router you wish. This helps keep `switcheroo` small and flexible. These design decisions also enable "decentralized routing" and more flexible and dynamic layouts.

- *Decentralized routing*: You can build out shareable React components using `switcheroo` and not worry about these components having knowledge of the router. Only the top level app that the components are being imported into needs to know about the router.
- *Flexible and dynamic layouts*: Most routing solutions have the notion of layouts, where each route has an explicit layout that is rendered on that route. This means if the components that make up those routes appear in multiple layouts, you need to define a top level layout for each combination that you desire, which can be repetitious. `switcheroo`'s decentralized nature allows each ["Switch"](docs/Switch.md) to specify all of the routes for which it should render, which means each layout can be dynamic. This prevents the case of having to create an entirely new layout for one small difference between an existing layout and will generally lead to less repetition/duplication in layouts. In addition to this, [`Switcher`](docs/Switcher.md)s can be nested infinitely, which allows for greater flexibility while still being expressive.


If you are looking for a more robust and opinionated routing solution, I highly recommend taking a look at [react-router](https://github.com/rackt/react-router). This project actually spawned from an attempt to do something [similar](https://gist.github.com/jdlehman/b662cac8b8607abf51a6) with react-router. *Update:* As of React Router v4, this is easily [doable](https://reacttraining.com/react-router/web/api/Switch) with v4's awesome component based API. The decision to use switcheroo or React Router now depends on if you need a full routing solution with history management etc. or just the ability to manage component presentation based on routes (which could be in conjunction with another routing solution). That said you could use both together without any issue, but if you already bring in React Router you can just use their built in [Switch component](https://reacttraining.com/react-router/web/api/Switch).
