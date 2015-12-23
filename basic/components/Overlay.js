import React, {Component} from 'react';
import Switcher from 'switcheroo';

export default class Overlay extends Component {
  closeOverlay(e) {
    window.location.hash = '/';
  }

  render() {
    return (
      <Switcher>
        <div path="/route2" className="overlay">
          <div className="overlay-close" onClick={this.closeOverlay}>Close</div>
          <h1 className="overlay-header">Full screen overlay!!</h1>
        </div>
      </Switcher>
    );
  }
}
