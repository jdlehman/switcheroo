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
        <Switcher wrapper="div" className="custom-bg-color">
          <div path="/route1">On route 1 with div wrapper to get custom background color</div>
          <div path="/route2">On route 2 with div wrapper to get custom background color</div>
          <Panel
            path="/route4"
            name="This is wrapped with a div having className custom-bg-color"
            items={panelItems} />
        </Switcher>
      </div>
    );
  }
}
