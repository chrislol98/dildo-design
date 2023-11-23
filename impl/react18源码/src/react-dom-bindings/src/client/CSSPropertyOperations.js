
export function setValueForStyles(node, styles) {
  const { style } = node;
  //styles={ color: "red" }
  for (const styleName in styles) {
    if (styles.hasOwnProperty(styleName)) {
      const styleValue = styles[styleName];
      // cmt 这样直接对对象赋值是内联样式
      style[styleName] = styleValue;
    }
  }
}