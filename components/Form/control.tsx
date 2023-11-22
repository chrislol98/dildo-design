import * as React from 'react';
import get from 'lodash/get'
export default class Control extends React.Component<any> {
  context: any;
  constructor(props,context) {
    super(props);
    if ('initialValue' in props && this.props.field) {
      context.store.setValue(props.fields, props.initialValue)
    }
  }


  render() {
    const {field, children} = this.props;
    const childProps = {
      onChange: () => {},
      value: get(this.context.store.innerGetStore(), field)
    }

    return <div>{React.cloneElement(children, childProps)}</div>;
  }
}
