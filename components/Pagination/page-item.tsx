import { StepType } from './interface';
function Pager(props) {
  const { pageNum, onClick: _onClick, disabled } = props;
  const onClick = (e) => {
    e.stopPropagation();
    !disabled && onClick?.(pageNum);
  };
  return <li>{pageNum}</li>;
}
export function JumpPager(props) {
  const { onClick: _onClick, allPages, current, jumpPage, disabled } = props;
  // 保证不超过allPages，也不小于minCurrent
  const minCurrent = allPages > 0 ? 1 : 0;
  const nextPage = Math.min(allPages, Math.max(minCurrent, current + jumpPage));
  const onClick = () => {
    !disabled && _onClick?.(nextPage);
  };
  return <li onClick={onClick}>...</li>;
}
export function stepPager(props) {
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
export default Pager;
