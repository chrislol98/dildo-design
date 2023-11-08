// import { observable, autorun } from '@/@formily/reactive';
// const values = { username: 'zhufeng', home: { name: 'beijing' } };
// const observableValues = observable(values);
// console.log(observableValues);
// console.log(observableValues.username);
// console.log(observableValues.home);
// console.log(observableValues.home);
// autorun(() => {
//   console.log(observableValues.username);
// });
// observableValues.username = 'jiagou';

import { autorun, define, observable } from '@/@formily/reactive';
const form = {
  values: { username: { value: 'zhufeng' } },
  fields: { username: { name: '用户名' } },
};
define(form, {
  values: observable,
  fields: observable.shallow,
});
autorun(() => {
  console.log(form.values, form.values.username, form.values.username.value);
  console.log(form.fields, form.fields.username, form.fields.username.name);
});
form.values.username.value = 'jiagou';
form.fields.username.name = '密码';

// import { observable, Tracker } from '@/@formily/reactive';
// const values = { username: 'zhufeng', home: { name: 'beijing' } };
// const observableValues = observable(values);
// const tracker = new Tracker(() => {
//   console.log('forceUpate');
// });
// tracker.track(() => {
//   console.log(observableValues.username);
// });
// observableValues.username = 'jiagou';
