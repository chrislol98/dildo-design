import { Meta, StoryObj } from '@storybook/react';
import { Form, Table } from '../components';
import * as React from 'react';
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Salary',
    dataIndex: 'salary',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];
const data = [
  {
    key: '1',
    name: 'Jane Doe',
    salary: 23000,
    address: '32 Park Road, London',
    email: 'jane.doe@example.com',
  },
  {
    key: '2',
    name: 'Alisa Ross',
    salary: 25000,
    address: '35 Park Road, London',
    email: 'alisa.ross@example.com',
  },
];
const App = () => {
  return (
    <div>
      <Table columns={columns} data={data} />
    </div>
  );
};

const meta: Meta<typeof App> = {
  component: App,
};
type Story = StoryObj<typeof App>;

export const XzcTable: Story = {
  render: () => <App />,
};
export default meta;
