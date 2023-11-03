import Store from './store';
import { ReactNode } from 'react';
export type FormInstance<FormData> = Pick<Store<FormData>, 'getFields' | 'submit' | 'registerField'> & {
  getInnerMethods: (inner?: boolean) => InnerMethodsReturnType<FormData>;
};
export type KeyType = string | number | symbol;
export type InnerMethodsReturnType<FormData> =
  Pick<Store<FormData>, 'innerSetFieldValue' | 'innerSetCallbacks'>
  ;

export type ValidateFieldsErrors<FieldValue = any, FieldKey extends KeyType = string> =
  | Record<FieldKey, FieldValue>
  | undefined
  | null;

export interface RulesProps<FieldValue = any> {
  validateTrigger?: string | string[];
  // 校验失败时候以 `error` 或 `warning` 形式展示错误信息。当设置为 `warning` 时不会阻塞表单提交
  validateLevel?: 'error' | 'warning';
  required?: boolean;
  type?: string;
  length?: number;
  // Array
  maxLength?: number;
  minLength?: number;
  includes?: boolean;
  deepEqual?: any;
  empty?: boolean;
  // Number
  min?: number;
  max?: number;
  equal?: number;
  positive?: boolean;
  negative?: boolean;
  // Object
  hasKeys?: string[];
  // String
  match?: RegExp;
  uppercase?: boolean;
  lowercase?: boolean;
  // Boolean
  true?: boolean;
  false?: boolean;
  // custom
  validator?: (value: FieldValue | undefined, callback: (error?: ReactNode) => void) => void;
  message?: ReactNode;
}




export interface FormValidateFn<
  FormData = any,
  FieldValue = FormData[keyof FormData],
  FieldKey extends KeyType = keyof FormData
> {
  /**
   * 验证所有表单的值，并且返回报错和表单数据
   */
  (): Promise<FormData>;

  /**
   * 验证所有表单的值，并且返回报错和表单数据
   * @param fields 需要校验的表单字段
   */
  (fields: FieldKey[]): Promise<Partial<FormData>>;

  /**
   * 验证所有表单的值，并且返回报错和表单数据
   * @param callback 校验完成后的回调函数
   */
  (
    callback: (errors?: ValidateFieldsErrors<FieldValue, FieldKey>, values?: FormData) => void
  ): void;

  /**
   * 验证所有表单的值，并且返回报错和表单数据
   * @param fields 需要校验的表单字段
   * @param callback 校验完成后的回调函数
   */
  (
    fields: FieldKey[],
    callback: (
      errors?: ValidateFieldsErrors<FieldValue, FieldKey>,
      values?: Partial<FormData>
    ) => void
  ): void;
}