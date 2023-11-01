import React, { Component } from 'react';
import { isSyntheticEvent } from '../_util/is';
import { FormItemContext } from './context';
import { schemaValidate } from './utils';


export default class Control extends Component<any> {
  static defaultProps = {
    trigger: 'onChange',
    triggerPropName: 'value',
  };

  static contextType = FormItemContext;

  private errors;

  private warnings;

  context: React.ContextType<typeof FormItemContext>;

  child: any;

  private removeRegisterField: () => void;

  constructor(props) {
    super(props);
  }


  private setWarnings = (warnings) => {
    this.warnings = warnings;
  };

  private setErrors = (errors) => {
    this.errors = errors;
  };


  componentDidMount(): void {
    const { store } = this.context;
    if (store) {
      const innerMethods = store.getInnerMethods(true);
      this.removeRegisterField = innerMethods.registerField(this);
    }
  }

  componentWillUnmount() {
    this.removeRegisterField && this.removeRegisterField();
    this.removeRegisterField = null;

  }

  private getFieldValue = () => {
    const field = this.props.field;
    const store = this.context.store;
    return field ? store.getInnerMethods(true).innerGetFieldValue(field) : undefined;
  };


  private updateFormItem = () => {
    this.forceUpdate();
    const { updateFormItem } = this.context as any;

    updateFormItem?.(this.props.field, {
      errors: this.errors,
      warnings: this.warnings,
    });
  };


  validateField = (
    triggerType?: string
  ): Promise<any> => {
    const { } = this.context;
    const { field, rules } = this.props;
    const value = this.getFieldValue();


    const validateMessages = {
      required: '#{field} 是必填项',
      type: {
        string: '#{field} 不是合法的文本类型',
        number: '#{field} 不是合法的数字类型',
        boolean: '#{field} 不是合法的布尔类型',
        array: '#{field} 不是合法的数组类型',
        object: '#{field} 不是合法的对象类型',
        url: '#{field} 不是合法的 url 地址',
        email: '#{field} 不是合法的邮箱地址',
        ip: '#{field} 不是合法的 IP 地址',
      },
      number: {
        min: '`#{value}` 小于最小值 `#{min}`',
        max: '`#{value}` 大于最大值 `#{max}`',
        equal: '`#{value}` 不等于 `#{equal}`',
        range: '`#{value}` 不在 `#{min} ~ #{max}` 范围内',
        positive: '`#{value}` 不是正数',
        negative: '`#{value}` 不是负数',
      },
      array: {
        length: '`#{field}` 个数不等于 #{length}',
        minLength: '`#{field}` 个数最少为 #{minLength}',
        maxLength: '`#{field}` 个数最多为 #{maxLength}',
        includes: '#{field} 不包含 #{includes}',
        deepEqual: '#{field} 不等于 #{deepEqual}',
        empty: '`#{field}` 不是空数组',
      },
      string: {
        minLength: '字符数最少为 #{minLength}',
        maxLength: '字符数最多为 #{maxLength}',
        length: '字符数必须是 #{length}',
        match: '`#{value}` 不符合模式 #{pattern}',
        uppercase: '`#{value}` 必须全大写',
        lowercase: '`#{value}` 必须全小写',
      },
      object: {
        deepEqual: '`#{field}` 不等于期望值',
        hasKeys: '`#{field}` 不包含必须字段',
        empty: '`#{field}` 不是对象',
      },
      boolean: {
        true: '期望是 `true`',
        false: '期望是 `false`',
      },
    }

    const _rules = !triggerType
      ? rules
      : (rules || []).filter((rule) => {
        const triggers = [].concat(rule.validateTrigger);
        return triggers.indexOf(triggerType) > -1;
      });

    if (_rules && _rules.length && field) {

      return schemaValidate(field, value, _rules, validateMessages).then(({ error, warning }) => {

        this.setErrors(error ? error[field] : null);
        this.setWarnings(warning || null);
        this.updateFormItem();

        return Promise.resolve({ error, value, field });
      });
    }


    return Promise.resolve({ error: null, value, field });
  };
  handleTrigger = (_value, ...args) => {
    const { field, trigger } = this.props;
    if (isSyntheticEvent(_value)) {
      _value = _value.nativeEvent.target.value;
    }


    this.innerSetFieldValue(field, _value);
    
    this.validateField(trigger);
  };

  innerSetFieldValue = (field, value) => {
    if (!field) return;
    const { store } = this.context;
    const methods = store.getInnerMethods(true);
    methods.innerSetFieldValue(field, value);
  };

  renderControl(children, field) {
    const { trigger } = this.props;
    const child = React.Children.only(children);
    const childProps = {
      [trigger]: this.handleTrigger,
      id: field,
    };
    return React.cloneElement(child, childProps);
  }

  render() {
    const { children, field } = this.props;
    let child = this.renderControl(children, field);
    return child;
  }
}
