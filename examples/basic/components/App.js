import React, {Component} from 'react';
import window from 'window';
import Content from './Content';

export default class App extends Component {
  changeRoute1(e) {
    window.location.hash = "/route1";
  }

  changeRoute2(e) {
    window.location.hash = "/route2";
  }

  render() {
    return (
      <div>
        <button onClick={this.changeRoute1}>Route1</button>
        <button onClick={this.changeRoute2}>Route2</button>
        <Content />
      </div>
    );
  }
}
