import React from 'react';
import { VariableSizeList } from './react-window';

const rowSizes = new Array(1000).fill(true).map(() => 25 + Math.round(Math.random() * 50));

const getItemSize = (index) => rowSizes[index];

const Row = ({ index, style, forwardRef }) => (
  <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style} ref={forwardRef}>
    Row {index}
  </div>
);
const App = () => {
  return (
    <VariableSizeList
      className="List"
      height={200}
      width={200}
      itemSize={getItemSize}
      itemCount={1000}
    >
      {Row}
    </VariableSizeList>
  );
};
export default App;
