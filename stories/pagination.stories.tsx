import { Meta, StoryObj } from '@storybook/react';
import { Pagination } from '../components';
import * as React from 'react';
const App = () => {
  return <Pagination total={3} />;
};

const meta: Meta<typeof App> = {
  component: App,
};
type Story = StoryObj<typeof App>;

export const XzcPagination: Story = {
  render: () => <App />,
};
export default meta;
