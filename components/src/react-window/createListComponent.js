function createListComponent({
  getEstimatedTotalSize,
  getItemSize,
  getItemOffset,
  getStartIndexForOffset, //根据向上卷去的高度计算开始索引
  getStopIndexForStartIndex, //根据开始索引和容器的高度计算结束索引
  initInstanceProps,
}) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.instanceProps = initInstanceProps && initInstanceProps(this.props);
      this.state = { scrollOffset: 0 };
      this.outerRef = React.createRef();
      this.oldFirstRef = React.createRef();
      this.oldLastRef = React.createRef();
      this.firstRef = React.createRef();
      this.lastRef = React.createRef();
    }
    static defaultProps = {
      overscanCount: 2,
    };
    componentDidMount() {
      this.observe((this.oldFirstRef.current = this.firstRef.current));
      this.observe((this.oldLastRef.current = this.lastRef.current));
    }
    componentDidUpdate() {
      if (this.oldFirstRef.current !== this.firstRef.current) {
        this.oldFirstRef.current = this.firstRef.current;
        this.observe(this.firstRef.current);
      }
      if (this.oldLastRef.current !== this.lastRef.current) {
        this.oldLastRef.current = this.lastRef.current;
        this.observe(this.lastRef.current);
      }
    }
    observe = (dom) => {
      let io = new IntersectionObserver(
        (entries) => {
          entries.forEach(this.onScroll);
        },
        { root: this.outerRef.current }
      );
      io.observe(dom);
    };
    render() {
      const { width, height, children: Row } = this.props;
      const containerStyle = {
        position: 'relative',
        width,
        height,
        overflow: 'auto',
        willChange: 'transform',
      };
      const contentStyle = {
        width: '100%',
        height: getEstimatedTotalSize(this.props, this.instanceProps),
      };
      const items = [];
      const [startIndex, stopIndex, originStartIndex, originStopIndex] = this.getRangeToRender();
      for (let index = startIndex; index <= stopIndex; index++) {
        const style = this.getItemStyle(index);
        if (index === originStartIndex) {
          items.push(
            <span
              key={'span' + index}
              ref={this.firstRef}
              style={{ ...style, width: 0, height: 0 }}
            ></span>
          );
          items.push(<Row key={index} index={index} style={style} />);
          continue;
        } else if (index === originStopIndex) {
          items.push(
            <span
              key={'span' + index}
              ref={this.lastRef}
              style={{ ...style, width: 0, height: 0 }}
            ></span>
          );
          items.push(<Row key={index} index={index} style={style} />);
          continue;
        }
        items.push(<Row key={index} index={index} style={style} />);
      }
      return (
        <div style={containerStyle} ref={this.outerRef}>
          <div style={contentStyle}>{items}</div>
        </div>
      );
    }
    onScroll = () => {
      const { scrollTop } = this.outerRef.current;
      this.setState({ scrollOffset: scrollTop });
    };
    getRangeToRender = () => {
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
        Math.min(itemCount - 1, stopIndex + overscanCount),
        startIndex,
        stopIndex,
      ];
    };
    getItemStyle = (index) => {
      const style = {
        position: 'absolute',
        width: '100%',
        height: getItemSize(this.props, index, this.instanceProps),
        top: getItemOffset(this.props, index, this.instanceProps),
      };
      return style;
    };
  };
}
