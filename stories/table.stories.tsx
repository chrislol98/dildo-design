import { Meta, StoryObj } from '@storybook/react';
import Demo from './table';

const meta: Meta<typeof Demo> = {
  component: Demo,
};
type Story = StoryObj<typeof Demo>;

export const 表单: Story = {
  render: () => <Demo />,
};
export default meta;
