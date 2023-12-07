export function getAdjustPageSize(sizeOptions, defaultPageSize) {
  if (sizeOptions && sizeOptions.length) {
    return sizeOptions[0];
  }
  return defaultPageSize;
}

export function getAdjustedCurrent(newPageSize, newTotal, current) {
  const newAllPages = getAllPages(newPageSize, newTotal);
  const newCurrent = current > newAllPages ? newAllPages : current;
  return newCurrent;
}

export function getAllPages(pageSize, total) {
  return Math.ceil(total / pageSize);
}

// 不懂 todo
export function getBufferSize(bufferSize, allPages) {
  const min = 0;
  const max = Math.floor(allPages / 2) - 1;
  const newBufferSize = Math.max(bufferSize, min);
  return Math.min(newBufferSize, max);
}
