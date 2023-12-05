import React from 'react';
const IS_SCROLLING_DEBOUNCE_INTERVAL = 150;
class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.domRef = React.createRef();
    this.resizeObserver = null;
  }
  componentDidMount() {
    if (this.domRef.current) {
      const node = this.domRef.current.firstChild;
      const { index, onSizeChange } = this.props;
      this.resizeObserver = new ResizeObserver(() => {
        onSizeChange(index, node);
      });
      this.resizeObserver.observe(node);
    }
  }
  componentWillUnmount() {
    if (this.resizeObserver && this.domRef.current.firstChild) {
      this.resizeObserver.unobserve(this.domRef.current.firstChild);
    }
  }
  render() {
    const { index, style, ComponentType } = this.props;
    return (
      <div style={style} ref={this.domRef} >
        <ComponentType index={index}/>
      </div>
    );
  }
}
export default function createListComponent({
  getEstimatedTotalSize, //获取预计的总高度
  getItemSize, //每个条目的高度
  getItemOffset, //获取每个条目的偏移量
  getStartIndexForOffset,
  getStopIndexForStartIndex,
  initInstanceProps,
  getOffsetForIndex,
}) {
  return class _ extends React.Component {
    outerRef = React.createRef();
    itemStyleCache = new Map();
    instanceProps = initInstanceProps && initInstanceProps(this.props);
    static defaultProps = {
      overscanCount: 3,
      useIsScrolling: false,
    };
    scrollTo = (scrollOffset) => {
      this.setState({ scrollOffset: Math.max(0, scrollOffset) });
    };
    scrollToItem = (index) => {
      const { itemCount } = this.props;
      index = Math.max(0, Math.min(index, itemCount - 1));
      this.scrollTo(getOffsetForIndex(this.props, index));
    };
    componentDidUpdate() {
      const { scrollOffset } = this.state;
      this.outerRef.current.scrollTop = scrollOffset;
    }
    state = { scrollOffset: 0, isScrolling: false };
    onSizeChange = (index, node) => {
      const height = node.offsetHeight;
      const { itemMetadataMap, lastMeasuredIndex } = this.instanceProps;
      const itemMetadata = itemMetadataMap[index];
      itemMetadata.size = height;
      let offset = 0;
      for (let i = 0; i <= lastMeasuredIndex; i++) {
        const itemMetadata = itemMetadataMap[i];
        itemMetadata.offset = offset;
        offset = offset + itemMetadata.size;
      }
      this.itemStyleCache.clear();
      this.forceUpdate();
    };
    render() {
      const {
        width,
        height,
        itemCount,
        children: ComponentType,
        isDynamic,
        useIsScrolling,
      } = this.props;
      const { isScrolling } = this.state;
      const containerStyle = {
        position: 'relative',
        width,
        height,
        overflow: 'auto',
        willChange: 'transform',
      };
      const contentStyle = {
        height: getEstimatedTotalSize(this.props, this.instanceProps),
        width: '100%',
      };
      const items = [];
      if (itemCount > 0) {
        const [startIndex, stopIndex] = this._getRangeToRender();
        for (let index = startIndex; index <= stopIndex; index++) {
          if (isDynamic) {
            items.push(
              <ListItem
                key={index}
                index={index}
                style={this._getItemStyle(index)}
                ComponentType={ComponentType}
                onSizeChange={this.onSizeChange}
                isScrolling={useIsScrolling && isScrolling}
              />
            );
          } else {
            items.push(
              <ComponentType
                key={index}
                index={index}
                style={this._getItemStyle(index)}
                isScrolling={useIsScrolling && isScrolling}
              />
            );
          }
        }
      }
      return (
        <div style={containerStyle} onScroll={this.handleOnScroll} ref={this.outerRef}>
          <div style={contentStyle}>{items}</div>
        </div>
      );
    }
    handleOnScroll = (event) => {
      const currentTarget = event.currentTarget;
      this.onScroll(currentTarget);
    };
    onScroll = (currentTarget) => {
      const { scrollTop } = currentTarget;
      this.setState(
        { scrollOffset: scrollTop, isScrolling: true },
        this._resetIsScrollingDebounced
      );
    };

    _resetIsScrollingDebounced = () => {
      if (this._resetIsScrollingTimeoutId) {
        clearTimeout(this._resetIsScrollingTimeoutId);
      }
      this._resetIsScrollingTimeoutId = setTimeout(
        this._resetIsScrolling,
        IS_SCROLLING_DEBOUNCE_INTERVAL
      );
    };

    debounce(fn, wait = 50) {
      // 通过闭包缓存一个定时器 id
      let timer = null;
      // 将 debounce 处理结果当作函数返回
      // 触发事件回调时执行这个返回函数
      return function (...args) {
        // this保存给context
        // 如果已经设定过定时器就清空上一次的定时器
        if (timer) clearTimeout(timer);

        // 开始设定一个新的定时器，定时器结束后执行传入的函数 fn
        timer = setTimeout(() => {
          fn(...args);
        }, wait);
      };
    }
    _resetIsScrolling = () => {
      this._resetIsScrollingTimeoutId = null;
      this.setState({ isScrolling: false });
    };
    _getItemStyle = (index) => {
      let style;
      if (this.itemStyleCache.has(index)) {
        style = this.itemStyleCache.get(index);
      } else {
        style = {
          position: 'absolute',
          width: '100%',
          height: getItemSize(this.props, index, this.instanceProps),
          top: getItemOffset(this.props, index, this.instanceProps),
        };
        this.itemStyleCache.set(index, style);
      }
      return style;
    };
    _getRangeToRender = () => {
      const { scrollOffset } = this.state;
      const { itemCount, overscanCount } = this.props;
      const startIndex = getStartIndexForOffset(this.props, scrollOffset, this.instanceProps);
      const stopIndex = getStopIndexForStartIndex(
        this.props,
        startIndex,
        scrollOffset,
        this.instanceProps
      );
      return [
        Math.max(0, startIndex - overscanCount),
        Math.max(0, Math.min(itemCount - 1, stopIndex + overscanCount)),
        startIndex,
        stopIndex,
      ];
    };
  };
}
