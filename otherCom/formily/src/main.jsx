import { observable, autorun } from '@/@formily/reactive';
const values = { username: 'zhufeng', home: { name: 'beijing' } };
const observableValues = observable(values);
console.log(observableValues);
console.log(observableValues.username);
console.log(observableValues.home);
console.log(observableValues.home);
autorun(() => {
  console.log(observableValues.username);
});
observableValues.username = 'jiagou';
