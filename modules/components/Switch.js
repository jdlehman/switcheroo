import React, {Component} from 'react';

export default class Switch extends Component {
  render() {
    return React.createElement(this.props.handler, this.props.handlerProps);
  }
}

Switch.displayName = 'Switch';

Switch.propTypes = {
  path: React.PropTypes.string.isRequired,
  handler: React.PropTypes.func.isRequired,
  handlerProps: React.PropTypes.object
};
