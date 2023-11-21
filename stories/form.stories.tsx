import { Meta, StoryObj } from '@storybook/react';
import Form from '../components';
const App = () => {
  return <Form></Form>;
};

const meta: Meta<typeof App> = {
  component: App,
};
type Story = StoryObj<typeof App>;

export const 表单: Story = {
  render: () => <App />,
};
export default meta;
