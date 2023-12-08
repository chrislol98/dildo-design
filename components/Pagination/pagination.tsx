import * as React from 'react';
import { useMergeProps } from '../shared';
import { getAdjustPageSize, getBufferSize, getAllPages } from './shared';
import { StepType } from './interface';
import Pager, { JumpPager, StepPager } from './page-item';

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

  function renderPagers() {
    const onPageNumberChange = (pageNumber) => {
      if (!('current' in props)) {
        setCurrent(pageNumber);
      }
    };
    const pagerProps = {
      ...props,
      current,
      pageSize,
      allPages,
      bufferSize,
      onClick: onPageNumberChange,
    };
    const pageList = [];
    const beginFoldPage = 1 + 2 + bufferSize;
    const endFoldPage = allPages - 2 - bufferSize;
    if (allPages <= 4 + bufferSize * 2 || (current === beginFoldPage && current === endFoldPage)) {
      for (let i = 1; i <= allPages; i++) {
        pageList.push(<Pager {...pagerProps} key={i} pageNum={i}></Pager>);
      }
    } else {
      let left = 1;
      let right = allPages;
      let hasJumpPre = true;
      let hasJumpNext = true;

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
      const JumpPre = (
        <JumpPager {...pagerProps} key={left - 1} jumpPage={-(bufferSize * 2 + 1)}></JumpPager>
      );
      const FirstPager = <Pager {...pagerProps} key={1} pageNum={1} />;
      if (hasJumpPre) {
        pageList.push(FirstPager);
        pageList.push(JumpPre);
      }

      for (let i = left; i <= right; i++) {
        pageList.push(<Pager {...pagerProps} key={i} pageNum={i} />);
      }

      const JumpNext = (
        <JumpPager {...pagerProps} key={right + 1} jumpPage={bufferSize * 2 + 1}></JumpPager>
      );
      const LastPager = <Pager {...pagerProps} key={allPages} pageNum={allPages} />;

      if (hasJumpNext) {
        pageList.push(JumpNext);
        pageList.push(LastPager);
      }
    }
    return (
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
        }}
      >
        <StepPager {...pagerProps} key="previous" type={StepType.previous} />
        {pageList}
        <StepPager key="next" {...pagerProps} type={StepType.next} />
      </ul>
    );
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
      {renderPagers()}
    </div>
  );
};

const forwardRefPagination = React.forwardRef(Pagination);

forwardRefPagination.displayName = 'Pagination';

export default forwardRefPagination;
