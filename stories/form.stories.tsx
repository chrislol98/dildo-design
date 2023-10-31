import { Meta, StoryObj } from '@storybook/react';
import { Form } from '../components';

const Demo = () => {
  return (
    <Form
      onChange={(value, store) => {
        // console.log(value, store);
      }}
      onValuesChange={(value, store) => {
        console.log(value, store);
      }}
      onSubmit={v => {
        console.log(v)
      }}
    >
      <Form.Item field={'name'} rules={[
        {
          validateTrigger: 'onChange',
          required: true,
          // validateLevel: 'error',
          // validator: (value, callback) => {

          //   console.log(value, 'value')
          //   if (!value) {
          //     callback('空的')
          //   }
          //   callback('自定义校验');
          // },
        },
      ]}>
        <input />
      </Form.Item>
      <button type="submit">1111</button>
    </Form>
  );
};

const meta: Meta<typeof Demo> = {
  component: Demo,
};
type Story = StoryObj<typeof Demo>;

export const 表单: Story = {
  render: () => <Demo />,
};
export default meta;
