import React, {Component} from 'react';
import {Switcher} from 'switcheroo';
import View1 from './View1';
import View2 from './View2';

export default class Content extends Component {
  render() {
    return (
      <Switcher>
        <div path="/">Default View</div>
        <View1 path="/route1" />
        <View2 path="/route2" />
      </Switcher>
    );
  }
}
