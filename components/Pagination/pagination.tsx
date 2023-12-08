import * as React from 'react';
import { useMergeProps } from '../shared';
import { getAdjustPageSize, getBufferSize, getAllPages } from './shared';
import Item, { stepPager } from './page-item';

const defaultProps = {
  total: 0,
  defaultCurrent: 1,
  defaultPageSize: 10,
  bufferSize: 2,
};

const Pagination = (_props, ref) => {
  const props = useMergeProps(_props, defaultProps, {});
  const {
    total,
    sizeOptions,
    defaultCurrent,
    current: _current,
    defaultPageSize,
    showTotal,
    bufferSize: _bufferSize,
    simple,
    pageSize: _pageSize,
  } = props;
  // 不懂 todo 受控 useMergedValue
  const [current, setCurrent] = React.useState(defaultCurrent);
  const [pageSize, setPageSize] = React.useState(getAdjustPageSize(sizeOptions, defaultPageSize));
  const allPages = getAllPages(pageSize, total);
  const bufferSize = getBufferSize(props.bufferSize, allPages);
  const pagerProps = {};
  function renderItems() {
    const pageList = [];
    // 不懂 判断条件未看
    const beginFoldPage = 1 + 2 + bufferSize;
    const endFoldPage = allPages - 2 - bufferSize;
    if (allPages <= 4 + bufferSize * 2 || (current === beginFoldPage && current === endFoldPage)) {
      for (let i = 1; i <= allPages; i++) {
        pageList.push(<Item key={i} pageNum={i}></Item>);
      }
    } else {
      let left = 1;
      let right = allPages;
      let hasJumpPre = true;
      let hasJumpNext = true;

      // 不懂 未看
      // fold front and back
      if (current > beginFoldPage && current < endFoldPage) {
        right = current + bufferSize;
        left = current - bufferSize;
        // fold back
      } else if (current <= beginFoldPage) {
        hasJumpPre = false;
        left = 1;
        right = Math.max(beginFoldPage, bufferSize + current);
        // fold begin
      } else if (current >= endFoldPage) {
        hasJumpNext = false;
        right = allPages;
        left = Math.min(endFoldPage, current - bufferSize);
      }
      const JumpPre = <div></div>;
      const FirstPager = <div></div>;
      if (hasJumpPre) {
        pageList.push(FirstPager);
        pageList.push(JumpPre);
      }

      for (let i = left; i <= right; i++) {
        pageList.push(<Item key={i} pageNum={i} {...pagerProps} />);
      }

      const JumpNext = <div></div>;
      const LastPager = <div></div>;

      if (hasJumpNext) {
        pageList.push(JumpNext);
        pageList.push(LastPager);
      }

      return <ul>stepPager {pageList} StepPager</ul>;
    }
  }

  function renderTotalElement() {
    if (typeof showTotal === 'boolean' && showTotal) {
      return total;
    }
    return null;
  }
  return (
    <div>
      {renderTotalElement()}
      {renderItems()}
    </div>
  );
};

const forwardRefPagination = React.forwardRef(Pagination);

forwardRefPagination.displayName = 'Pagination';

export default forwardRefPagination;
