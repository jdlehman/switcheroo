# SwitcherProvider

The `SwitcherProvider` is a higher order component (HOC), that you can add to the top level of your component tree (or at least higher up then all of your [`Switcher`](./Switcher.md) components). This will hook into React's context and only register event handlers (`load`, `pushState`, and `hashChange`) once, rather than for each `Switcher`. This should improve performance for applications that make liberal use of `switcheroo`.

If the `SwitcherProvider` has more than one child, it will wrap the children in a span with the class `switcher-provider`, otherwise it will just render its single child.

```js
<App>
  <SwitcherProvider>
    <SideBar>
      <Switcher>
        <div path="/">Sidebar Stuff</div>
        <div path="/more">More Sidebar Stuff</div>
      </Switcher>
    </SideBar>
    <Stuff />
    <MoreStuff />
    <Content>
      <Switcher>
        <div path="/">Content Stuff</div>
        <div path="/more">More Content Stuff</div>
      </Switcher>
    </Content>
  </SwitcherProvider>
</App>
```
