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

// import { autorun, define, observable } from '@/@formily/reactive';
// const form = {
//   values: { username: { value: 'zhufeng' } },
//   fields: { username: { name: '用户名' } },
// };
// define(form, {
//   values: observable,
//   fields: observable.shallow,
// });
// autorun(() => {
//   console.log(form.values, form.values.username, form.values.username.value);
//   console.log(form.fields, form.fields.username, form.fields.username.name);
// });
// form.values.username.value = 'jiagou';
// form.fields.username.name = '密码';

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

// import React from 'react'
// import { createRoot } from 'react-dom/client'
// import Counter from './Counter';
// createRoot(document.getElementById('root')).render(<Counter />);

// import { createForm } from '@/@formily/core';
// const form = createForm({
//   values: {
//     username: 'zhufeng',
//   },
// });
// console.log(form);
// const field = form.createField({ name: 'username', title: '用户名', value: 'zhufeng' });
// console.log(field);


import React from "react";
import ReactDOM from "react-dom/client";
import { createForm } from "@/@formily/core";
import { FormProvider, Field } from "@/@formily/react";
import { FormItem, Input } from "@/@formily/antd";
const form = createForm();
const App = () => {
    return (
        <FormProvider form={form}>
            <Field
                name="username"
                title="用户名"
                value="jiagou"
                decorator={[FormItem]}
                component={[Input]}
            />
            <button onClick={() => {
                form.submit(console.log)
            }}>提交</button>
        </FormProvider>
    )
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);