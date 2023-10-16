import Store from './store';
export type FormInstance<FormData> = Pick<Store<FormData>, 'getFields' | 'submit'> & {
  getInnerMethods: (inner?: boolean) => InnerMethodsReturnType<FormData>;
};

export type InnerMethodsReturnType<FormData> =
  Pick<Store<FormData>, 'innerSetFieldValue' | 'innerSetCallbacks'>
;
