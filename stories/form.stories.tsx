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
          validator: async (value, callback) => {
            return new Promise((resolve) => {
              setTimeout(() => {

                callback('校验');
                resolve('');
              }, 5000);
            });
          },
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
