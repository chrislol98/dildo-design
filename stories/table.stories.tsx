import { Meta, StoryObj } from '@storybook/react';
import { Form, Table } from '../components';
import * as React from 'react';
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    },
  },
  {
    title: 'Age',
    dataIndex: 'age',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Score A',
    dataIndex: 'scoreA',
    sortOrder: 'descend',
    sorter: {
      compare: (a, b) => a.scoreA - b.scoreA,
      multiple: 3,
    },
  },
  {
    title: 'Score B',
    dataIndex: 'scoreB',

    defaultSortOrder: 'descend',
    sorter: {
      compare: (a, b) => a.scoreB - b.scoreB,
      multiple: 2,
    },
  },
  {
    title: 'Score C',
    dataIndex: 'scoreC',
    defaultSortOrder: 'descend',
    sorter: {
      compare: (a, b) => a.scoreC - b.scoreC,
      multiple: 1,
    },
  },
];
const data = [
  {
    key: '1',
    name: 'A',
    age: 18,
    scoreA: 100,
    scoreB: 60,
    scoreC: 70,
  },
  {
    key: '2',
    name: 'B',
    age: 17,
    scoreA: 100,
    scoreB: 90,
    scoreC: 80,
  },
  {
    key: '3',
    name: 'C',
    age: 19,
    scoreA: 100,
    scoreB: 70,
    scoreC: 60,
  },
  {
    key: '4',
    name: 'D',
    age: 15,
    scoreA: 80,
    scoreB: 70,
    scoreC: 100,
  },
  {
    key: '5',
    name: 'E',
    age: 20,
    scoreA: 80,
    scoreB: 70,
    scoreC: 90,
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
