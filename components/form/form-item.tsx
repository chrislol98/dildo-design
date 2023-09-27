import Control from './control';
const Item = (props) => {
  return <Control {...props}>{props.children}</Control>;
};

export default Item;
