import { Meta, StoryObj } from '@storybook/react';
import { Popup } from '../components';
import * as React from 'react';
const App = () => {
  return (
    <div
      style={{
        height: '500px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Popup content="这是一个弹出框" trigger="hover" placement="left-top">
        <button>按钮</button>
      </Popup>
    </div>
  );
};

const meta: Meta<typeof App> = {
  component: App,
};
type Story = StoryObj<typeof App>;

export const XzcPopup: Story = {
  render: () => <App />,
};
export default meta;
