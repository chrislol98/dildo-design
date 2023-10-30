import Store from './store';
export type FormInstance<FormData> = Pick<Store<FormData>, 'getFields' | 'submit' | 'registerField'> & {
  getInnerMethods: (inner?: boolean) => InnerMethodsReturnType<FormData>;
};

export type InnerMethodsReturnType<FormData> =
  Pick<Store<FormData>, 'innerSetFieldValue' | 'innerSetCallbacks'>
;
