import { Meta, StoryObj } from '@storybook/react';
import { Form } from '../components';
import * as React from 'react';
const App = () => {
  // const [form] = Form.useForm();
  const formRef = React.useRef();
  return (
    <Form
      // form={form}
      ref={formRef}
      initialValues={{
        xzc: 234,
        zzw: 1111111111111,
      }}
      onChange={() => {
        console.log('onchange');
      }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <Form.Item initialValue={123} field="xzc">
        <input></input>
      </Form.Item>
      <Form.Item field="zzw">
        <input type="submit"></input>
      </Form.Item>
    </Form>
  );
};

const meta: Meta<typeof App> = {
  component: App,
};
type Story = StoryObj<typeof App>;

export const 表单: Story = {
  render: () => <App />,
};
export default meta;
