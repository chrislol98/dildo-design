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
export function StepPager(props) {}
export default Pager;
