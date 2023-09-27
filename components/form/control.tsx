import React, { Component } from 'react';

export default class Control extends Component<any> {
  static defaultProps = {
    trigger: 'onChange',
    triggerPropName: 'value',
  };
  context: any;

  constructor(props) {
    super(props);
  }

  handleTrigger = (value, ...args) => {
    const { field } = this.props;
    this.innerSetFieldValue(field, value);
  };

  innerSetFieldValue(field, value) {
    const { store } = this.context;
    const methods = store.getInnerMethods(true);

    methods.innerSetFieldValue(field, value);
  }

  // render
  renderControl(children) {
    const { trigger } = this.props;
    const child = React.Children.only(children);
    const childProps: Record<PropertyKey, any> = {
      [trigger]: this.handleTrigger,
    };

    return React.cloneElement(child, childProps);
  }

  render() {
    let child = this.renderControl(this.props.children);
    // 不懂 不能写成 <child />
    return <div>{child}</div>;
  }
}
