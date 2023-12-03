import * as React from 'react';
// React.memo
// export default function App() {
//   const [state, setState] = React.useState(0);
//   return (
//     <div>
//       App <Child />
//       <button onClick={() => setState(state + 1)}></button>
//     </div>
//   );
// }

// const Child = React.memo((props) => {
//   return <div>Child</div>;
// });

// 新旧props
export default function App() {
  const [state, setState] = React.useState(0);
  return (
    <div>
      App <Child />
      <button onClick={() => setState(state + 1)}></button>
    </div>
  );
}

const Child = React.memo((props) => {
  return <div>Child</div>;
});

console.log(React.createElement('div', {}));
