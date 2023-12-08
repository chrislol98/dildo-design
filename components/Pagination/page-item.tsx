export enum StepType {
  previous,
  next,
}
function Item(props) {
  return <div></div>;
}

function stepPager(props) {
  const { type, disabled, allPages, current } = props;

  function getMergedDisabled() {
    let _disabled = false;
    if (allPages === 0) {
      // total为0
      _disabled = true;
    } else if (type === StepType.previous) {
      // 向前翻页
      _disabled = current <= 1; // current ===0 || current===1
    } else {
      // 向后翻页
      _disabled = current === allPages;
    }

    return _disabled || disabled;
  }

  const mergedDisabled = getMergedDisabled();
  const StepIcon = type === StepType.previous ? '<' : '>';
  const onClick = () => {
    if (mergedDisabled) {
      return;
    }
    let nextPage = current + (type === StepType.previous ? -1 : 1);
    nextPage = Math.max(0, Math.min(allPages, nextPage));
    props.onClick && props.onClick(nextPage);
  };

  return <li onClick={onClick}>{StepIcon}</li>;
}

export default Item;
