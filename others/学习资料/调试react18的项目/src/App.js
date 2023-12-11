import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import './App.css';
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
  const [show, setShow] = React.useState(true);
  function toggleShow() {
    setShow(!show);
  }
  return (
    <div>
      <CSSTransition in={show} timeout={1000} classNames="fade" unmountOnExit appear={true}>
        <div>hello</div>
      </CSSTransition>
      <button onClick={toggleShow}>toggle</button>
    </div>
  );
});

console.log(Child, 'child');
