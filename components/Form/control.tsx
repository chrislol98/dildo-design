import get from 'lodash/get';
import * as React from 'react';
import { isSyntheticEvent } from '../shared';
import { ItemContext } from './context';
export default class Control extends React.Component<any> {
  // 不懂 static 有什么用？
  static contextType = ItemContext;
  context: any;

  constructor(props, context) {
    super(props);
    const { field } = props;
    const { formInstance } = context;
    if ('initialValue' in props && field) {
      formInstance.setValue(field, props.initialValue);
    }
  }
  componentDidMount() {
    const { formInstance } = this.context;
    formInstance.registerField(this);
  }

  onStoreChange = () => {
    console.log('onStorageChange')
    this.forceUpdate();
  };

  handleTrigger = (value) => {
 
    const { formInstance } = this.context;
    const { field } = this.props;
    if (isSyntheticEvent(value)) {
      value = value.nativeEvent.target.value;
    }
    formInstance.setValue(field, value);
  };

  render() {
    const { field, children } = this.props;
    const { formInstance } = this.context;

    const childProps = {
      onChange: this.handleTrigger,
      value: get(formInstance.getStore(), field),
    };

    return <div>{React.cloneElement(children, childProps)}</div>;
  }
}
