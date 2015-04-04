import React, {Component} from 'react';

export default class Switch extends Component {
  componentDidMount() {
    if(typeof this.props.onShow === 'function') {
      this.props.onShow();
    }
  }

  componentWillUnmount() {
    if(typeof this.props.onHide === 'function') {
      this.props.onHide();
    }
  }

  render() {
    return React.createElement(this.props.handler, this.props.handlerProps);
  }
}

Switch.displayName = 'Switch';

Switch.propTypes = {
  path: React.PropTypes.string.isRequired,
  handler: React.PropTypes.func.isRequired,
  handlerProps: React.PropTypes.object,
  onShow: React.PropTypes.func,
  onHide: React.PropTypes.func
};
