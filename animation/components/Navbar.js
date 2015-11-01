import React, {Component} from 'react';

export default class Navbar extends Component {
  changeIndex(e) {
    window.location = "../index.html";
  }

  changeRoute1(e) {
    window.location.hash = "/route1";
  }

  changeRoute2(e) {
    window.location.hash = "/route2";
  }

  changeRoute3(e) {
    window.location.hash = "/route3";
  }

  changeRoute4(e) {
    window.location.hash = "/route4";
  }

  render() {
    return (
      <div className="navbar">
        <div className="navbar-item" onClick={this.changeIndex}>Example Index</div>
        <div className="navbar-item" onClick={this.changeRoute1}>Route 1</div>
        <div className="navbar-item" onClick={this.changeRoute2}>Route 2</div>
        <div className="navbar-item" onClick={this.changeRoute3}>Route 3</div>
        <div className="navbar-item" onClick={this.changeRoute4}>Route 4</div>
      </div>
    );
  }
}
