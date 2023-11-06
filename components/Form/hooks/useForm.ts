import { useCreation } from 'ahooks';
import type { FormInstance, InnerMethodsReturnType } from '../interface';
import Store from '../store';

// 不懂 todo 是不是什么设计模式？不是有什么方法重构
function gtFormInstance<FormData>(): FormInstance<FormData> {
  const store = new Store<FormData>();
  return {
    submit: store.submit,
    getFields: store.getFields,
    registerField: store.registerField,
    getInnerMethods: (inner: boolean) => {
      // 不懂 const methods: InnerMethodsReturnType<FormData> = {};
      // let a = {a: 1} as {a: number}
      // let b: {a?: number} = {}
      const methods = {} as InnerMethodsReturnType<FormData>;
      if (inner) {
        // 不懂 map随便加类型不会报错
        ['innerSetFieldValue', 'innerSetCallbacks', 'registerField','innerGetFieldValue'].map((key) => {
          methods[key] = store[key];
        });
      }
      return methods;
    },
  };
}

export default function useForm(form) {
  // api useCreation hook 单例模式
  const formInstance = useCreation(() => {
    return gtFormInstance();
  }, []);
  return [formInstance];
}