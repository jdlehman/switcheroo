import React, { Component } from 'react';
import { SwitcherProvider } from 'switcheroo';
import Navbar from './Navbar';
import LeftContent from './LeftContent';
import RightContent from './RightContent';
import Overlay from './Overlay';

export default class App extends Component {
  render() {
    return (
      <SwitcherProvider>
        <div className="app">
          <Navbar />
          <div className="content">
            <LeftContent />
            <RightContent />
            <Overlay />
          </div>
        </div>
      </SwitcherProvider>
    );
  }
}
