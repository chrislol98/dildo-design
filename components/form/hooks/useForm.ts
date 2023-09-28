import { useCreation } from 'ahooks';
import Store from '../store';

// 不懂 todo 是不是什么设计模式？不是有什么方法重构
function gtFormInstance() {
  const store = new Store();
  return {
    getInnerMethods: (inner) => {
      const methods = {};
      if (inner) {
        ['innerSetInitialValues', 'innerSetFieldValue', 'innerSetCallbacks'].map((key) => {
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
