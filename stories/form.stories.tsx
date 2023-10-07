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
    >
      <Form.Item field={'name'}>
        <input />
      </Form.Item>
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
