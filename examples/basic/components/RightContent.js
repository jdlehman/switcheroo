import React, {Component} from 'react';
import Switcher from 'switcheroo';
import Panel from './Panel';

export default class RightContent extends Component {
  render() {
    var panelItems = [
      {content: 'Hello world'},
      {content: 'Bonjour le monde'}
    ];

    return (
      <div className="content-right">
        <h2>Right Content</h2>
        <Switcher>
          <div path="/route1">On route 1</div>
          <div path="/route2">On route 2</div>
          <Panel
            path="/route4"
            name="Hello"
            items={panelItems} />
        </Switcher>
      </div>
    );
  }
}
