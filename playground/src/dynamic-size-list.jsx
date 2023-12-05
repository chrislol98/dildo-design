import React from 'react';
import { VariableSizeList } from './react-window';

const items = [];
for (let i = 0; i < 1000; i++) {
  const height = 30 + Math.floor(Math.random() * 20) + 'px';
  const style = {
    height,
    width: `100%`,
    backgroundColor: i % 2 ? 'green' : 'orange',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  items.push(<div style={style}>Row {i}</div>);
}

const Row = ({ index }) => items[index];
const App = () => {
  return (
    <VariableSizeList isDynamic={true} className="List" height={150} width={150} itemCount={1000}>
      {Row}
    </VariableSizeList>
  );
};
export default App;
