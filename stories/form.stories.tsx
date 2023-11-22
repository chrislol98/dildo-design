import { Meta, StoryObj } from '@storybook/react';
import { Form } from '../components';
const App = () => {
  return (
    <Form
      initialValues={{
        xzc: 234,
        zzw: 1111111111111,
      }}
    >
      <Form.Item initialValue={123} field="xzc">
        <input></input>
      </Form.Item>
      <Form.Item field="zzw">
        <input></input>
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
