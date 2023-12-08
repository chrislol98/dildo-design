import { isArray, isObject, useMergeProps } from '../../shared';
import * as React from 'react';
import { Pagination } from '../../index';

function getPageData(
  currentData,
  props,
  options: {
    paginationProps;
    pagination;
  }
) {
  const { data } = props;
  const { paginationProps, pagination } = options;
  const { current = 0, pageSize = 10 } = paginationProps;
  if (pagination === false) {
    return currentData;
  }
  if (isObject(pagination) && data.length <= pageSize) {
    return currentData;
  }
  return currentData.slice((current - 1) * pageSize, current * pageSize);
}

function getPaginationProps(
  data,
  options: {
    mergePagination;
    pageSize;
    current;
    setCurrent;
    pagination;
    onPaginationChange;
  }
) {
  const pageSize = options.mergePagination.pageSize || options.pageSize || 10;

  const total = isArray(data) ? data.length : 0;

  const current = Math.ceil(total / pageSize) < options.current ? 1 : options.current;

  if (current !== options.current) {
    options.setCurrent(current);
  }

  let paginationProps: any = {
    total,
    pageSize,
    current,
  };

  if (isObject(options.pagination)) {
    paginationProps = {
      ...paginationProps,
      ...options.pagination,
    };
  }

  if (isObject(options.mergePagination)) {
    paginationProps = {
      ...paginationProps,
      ...options.mergePagination,
    };
  }
  paginationProps.onChange = options.onPaginationChange;
  return paginationProps;
}

export default function usePagination(data, options: { props }) {
  const { props } = options;
  const { pagination, renderPagination } = props;

  // const { componentConfig，tablePagination } = useContext(ConfigContext);
  const mergePagination = useMergeProps(
    isObject(pagination) ? pagination : {},
    // isObject(componentConfig?.Table?.pagination) ? componentConfig?.Table?.pagination : {},
    // tablePagination || {}
    {},
    {}
  );
  function usePageSize(): [any, React.Dispatch<any>] {
    const [pageSize, setPageSize] = React.useState(
      mergePagination.pageSize || mergePagination.defaultPageSize || 10
    );
    return [mergePagination.pageSize || pageSize || 10, setPageSize];
  }
  const [pageSize, setPageSize] = usePageSize();
  const [current, setCurrent] = React.useState<number>(1);
  function onPaginationChange(current, pageSize) {
    setCurrent(current);
    setPageSize(pageSize);

    // todo 放到useSection里面
    // if (rowSelection && !rowSelection.checkCrossPage && selectedRowKeys.length) {
    //   setSelectedRowKeys([]);
    //   rowSelection.onChange && rowSelection.onChange([], []);
    // }

    mergePagination.onChange && mergePagination.onChange(current, pageSize);
  }
  const paginationProps = getPaginationProps(data, {
    mergePagination,
    pageSize,
    current,
    setCurrent,
    pagination,
    onPaginationChange,
  });

  const pageData = getPageData(data, props, { pagination, paginationProps });
  
  const paginationEle = renderPagination ? (
    renderPagination(<Pagination {...paginationProps} />)
  ) : (
    <Pagination {...paginationProps} />
  );
  return [pageData, paginationEle];
}
