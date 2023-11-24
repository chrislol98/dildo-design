const ColGroup = (props) => {
  const { columns } = props;
  return (
    <colgroup>
      {columns.map((col, idx) => {
        return <col key={col.key || idx} />;
      })}
    </colgroup>
  );
};

export default ColGroup;
