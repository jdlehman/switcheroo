import React, { Component } from 'react';
import { VelocityTransitionGroup } from 'velocity-react';
import Switcher from 'switcheroo';

export default class Overlay extends Component {
  closeOverlay(e) {
    window.location.hash = '/';
  }

  render() {
    var Animations = {
      slideUpIn: {
        animation: {
          translateY: 0
        },
        style: {
          translateY: '100%'
        },
        duration: 300,
        easing: 'ease-in'
      },
      slideUpOut: {
        animation: {
          translateY: '100%'
        },
        style: {
          translateY: 0
        },
        duration: 300,
        easing: 'ease-out'
      }
    };
    return (
      <Switcher
        wrapper={VelocityTransitionGroup}
        enter={Animations.slideUpIn}
        leave={Animations.slideUpOut}
      >
        <div path="/route2" className="overlay">
          <div className="overlay-close" onClick={this.closeOverlay}>Close</div>
          <h1 className="overlay-header">
            Full screen overlay was animated using JavaScript animations via velocity-react!!
          </h1>
        </div>
      </Switcher>
    );
  }
}
