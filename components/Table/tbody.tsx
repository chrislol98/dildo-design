import { useComponent } from './shared';
const TBody = (props) => {
  const { columns, data, components } = props;
  const { ComponentTbody } = useComponent(components);

  return <ComponentTbody>{data}</ComponentTbody>;
};

export default TBody;
