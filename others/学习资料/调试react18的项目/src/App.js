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

// const Child = React.memo((props) => {
//   return <div>Child</div>;
// });
let Child = (props) => {
  return <div>Child</div>;
};
Child.displayName = 'Child';

Child = React.forwardRef(Child);

console.log(Child, 'child');
