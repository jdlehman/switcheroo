import React, {Component} from 'react';

export default class Panel extends Component {
  renderPanelItems() {
    return this.props.items.map(function(item) {
      return (
        <div className="panel-item">{item.content}</div>
      );
    });
  }

  render() {
    return (
      <div className="panel">
        <h2>Panel Name: {this.props.name}</h2>
        {this.renderPanelItems.call(this)}
      </div>
    );
  }
}
