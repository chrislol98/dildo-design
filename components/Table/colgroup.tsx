import { INTERNAL_EXPAND_KEY, INTERNAL_SELECTION_KEY } from './shared';
function fixedWidth(width?: number | string) {
  return typeof width === 'number' || typeof width === 'string'
    ? {
        width,
      }
    : {};
}
const ColGroup = (props) => {
  const { columns } = props;
  return (
    <colgroup>
      {columns.map((col, idx) => {
        if (col.title === INTERNAL_EXPAND_KEY) {
          return <col key={INTERNAL_EXPAND_KEY} style={fixedWidth(col.width)} />;
        }
        if (col.title === INTERNAL_SELECTION_KEY) {
          return <col key={INTERNAL_SELECTION_KEY} style={fixedWidth(col.width)} />;
        }
        return <col key={col.key || idx} />;
      })}
    </colgroup>
  );
};

export default ColGroup;
