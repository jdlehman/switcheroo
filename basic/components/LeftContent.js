import React, {Component} from 'react';
import {Switcher} from 'switcheroo';
import Panel from './Panel';

function defaultView() {
  return <div>Default Content: No matching route</div>;
}

export default class LeftContent extends Component {
  render() {
    var panelItems = [
      {content: 'Some content'},
      {content: 'Other content'},
      {content: 'Even more content'}
    ];

    return (
      <div className="content-left">
        <h2>Left Content</h2>
        <Switcher defaultHandler={defaultView}>
          <div path="/route1">Route 1 rules!</div>
          <div path="/route2">Route 2 for life</div>
          <Panel
            path="/route3"
            name="Stuff"
            items={panelItems} />
        </Switcher>
      </div>
    );
  }
}
