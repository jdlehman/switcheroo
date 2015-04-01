# Switcheroo

Switcheroo allows you to specify a React component that renders a specific component based on the URL. Looks at hash location by default (`location.hash`), but also supports [`pushState`](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history).

## Example

```js
import React, {Component} from 'react';
import {Switcher, Switch} from 'switcheroo';
import DefaultHeader from 'components/DefaultHeader';
import AccountHeader from 'components/DefaultHeader';
import StoreHeader from 'components/StoreHeader';
import Body from 'components/Body';
import Footer from 'components/Footer';

class MyComponent extends Component {
  render() {
    return (
      <div>
        <Switcher>
          <Switch path="/" handler={DefaultHeader}/>
          <Switch path="/login" handler={AccountHeader}/>
          <Switch path="/store" handler={StoreHeader}/>
        </Switcher>
        <Body />
        <Footer />
      </div>
    );
  }
}
```

You can use `pushState` by setting the `pushState` property on `Switcher` like `<Switcher pushState={true}>...`
