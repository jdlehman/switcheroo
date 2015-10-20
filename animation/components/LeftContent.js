import React, {Component} from 'react';
import {Switcher} from 'switcheroo';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Panel from './Panel';

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
        <Switcher
            wrapper={ReactCSSTransitionGroup}
            transitionName="example"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}>
          <div path="/route1">
            Animated on Route 1 with ReactCSSTranstionGroup
          </div>
          <div path="/route2">
            Animated on Route 2 with ReactCSSTranstionGroup
          </div>
          <Panel
            path="/route3"
            name="Stuff Animated with ReactCSSTransitionGroup"
            items={panelItems} />
        </Switcher>
      </div>
    );
  }
}
