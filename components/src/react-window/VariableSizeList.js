import createListComponent from './createListComponent';
const DEFAULT_ESTIMATED_SIZE = 50;
const getEstimatedTotalSize = (
  { itemCount },
  { estimatedItemSize, lastMeasuredIndex, itemMetadataMap }
) => {
  let totalSizeOfMeasuredItems = 0; //计算过的条目总大小
  if (lastMeasuredIndex >= 0) {
    const itemMetadata = itemMetadataMap[lastMeasuredIndex];
    totalSizeOfMeasuredItems = itemMetadata.offset + itemMetadata.size; //测试过的总大小
  }
  const numUnmeasuredItems = itemCount - lastMeasuredIndex - 1; //未测量的条目
  const totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedItemSize; //未测量条目的总高度
  return totalSizeOfMeasuredItems + totalSizeOfUnmeasuredItems;
};
function findNearestItem(props, instanceProps, offset) {
  const { itemMetadataMap, lastMeasuredIndex } = instanceProps;
  const lastMeasuredItemOffset =
    lastMeasuredIndex > 0 ? itemMetadataMap[lastMeasuredIndex].offset : 0;
  if (lastMeasuredItemOffset >= offset) {
    return findNearestItemBinarySearch(props, instanceProps, lastMeasuredIndex, 0, offset);
  } else {
    return findNearestItemExponentialSearch(
      props,
      instanceProps,
      Math.max(0, lastMeasuredIndex),
      offset
    );
  }
}
function findNearestItemExponentialSearch(props, instanceProps, index, offset) {
  const { itemCount } = props;
  let interval = 1;
  while (index < itemCount && getItemMetadata(props, index, instanceProps).offset < offset) {
    index += interval;
    interval *= 2;
  }
  return findNearestItemBinarySearch(
    props,
    instanceProps,
    Math.min(index, itemCount - 1),
    Math.floor(index / 2),
    offset
  );
}
const findNearestItemBinarySearch = (props, instanceProps, high, low, offset) => {
  while (low <= high) {
    const middle = low + Math.floor((high - low) / 2);
    const currentOffset = getItemMetadata(props, middle, instanceProps).offset;
    if (currentOffset === offset) {
      return middle;
    } else if (currentOffset < offset) {
      low = middle + 1;
    } else if (currentOffset > offset) {
      high = middle - 1;
    }
  }
  if (low > 0) {
    return low - 1;
  } else {
    return 0;
  }
};
function getItemMetadata(props, index, instanceProps) {
  const { itemSize } = props;
  const { itemMetadataMap, lastMeasuredIndex } = instanceProps;
  if (index > lastMeasuredIndex) {
    let offset = 0; //先计算上一个测试过的条目的下一个offset
    if (lastMeasuredIndex >= 0) {
      const itemMetadata = itemMetadataMap[lastMeasuredIndex];
      offset = itemMetadata.offset + itemMetadata.size;
    }
    //计算从上一个条目到本次索引的offset和size
    for (let i = lastMeasuredIndex + 1; i <= index; i++) {
      let size = itemSize(i);
      itemMetadataMap[i] = { offset, size };
      offset += size;
    }
    instanceProps.lastMeasuredIndex = index;
  }
  return itemMetadataMap[index];
}
const VariableSizeList = createListComponent({
  getEstimatedTotalSize,
  getStartIndexForOffset: (props, offset, instanceProps) =>
    findNearestItem(props, instanceProps, offset),
  getStopIndexForStartIndex: (props, startIndex, scrollOffset, instanceProps) => {
    const { itemCount, height } = props;
    const itemMetadata = getItemMetadata(props, startIndex, instanceProps);
    const maxOffset = scrollOffset + height;
    let offset = itemMetadata.offset + itemMetadata.size;
    let stopIndex = startIndex;
    while (stopIndex < itemCount - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemMetadata(props, stopIndex, instanceProps).size;
    }
    return stopIndex;
  },
  getItemSize: (props, index, instanceProps) => getItemMetadata(props, index, instanceProps).size,
  getItemOffset: (props, index, instanceProps) =>
    getItemMetadata(props, index, instanceProps).offset,
  initInstanceProps(props) {
    const { estimatedItemSize } = props;
    const instanceProps = {
      estimatedItemSize: estimatedItemSize || DEFAULT_ESTIMATED_SIZE,
      itemMetadataMap: {}, //存放每个条目的高度和偏移量
      lastMeasuredIndex: -1, //最后一个测量高度的索引
    };
    return instanceProps;
  },
});
export default VariableSizeList;
