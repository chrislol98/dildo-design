import { Meta, StoryObj } from '@storybook/react';
import { Form } from '../components';

// done
// 基础用法 非受控
// 受控表单  notify(对应field改变，对应form.item更新)
// 复杂类型的数据
// 表单控件嵌套 原生支持
// 表单异步校验
// 表单控件联动

// todo
// 表单校验 差能調用form.validate
// 多表单联动
// useWatch

const DynamicContent = () => {
  return <div>{~~(Math.random() * 1000)}</div>;
};
const Demo = () => {
  return (
    <Form
      onChange={(value, store) => {
        // console.log(value, store);
      }}
      onValuesChange={(value, store) => {
        console.log(value, store);
      }}
      onSubmit={(v) => {
        console.log('onSubmit');
      }}
      onSubmitFailed={(...rest) => {
        console.log('onSubmitFailed');
      }}
    >
      <Form.Item>
        <Form.Item
          field="xzc"
          rules={[
            {
              validateTrigger: 'onChange',
              required: true,
              validator: async (value, callback) => {
                return new Promise((resolve) => {
                  setTimeout(() => {
                    callback('过了2000吗');
                    resolve('');
                  }, 10);
                });
              },
            },
          ]}
        >
          <input />
        </Form.Item>
        <Form.Item
          field="yinzi"
          rules={[{ required: true, validateTrigger: 'onChange' }]}
          shouldUpdate
        >
          <DynamicContent />
        </Form.Item>
      </Form.Item>

      <button type="submit">1111</button>
    </Form>
  );
};

const meta: Meta<typeof Demo> = {
  component: Demo,
};
type Story = StoryObj<typeof Demo>;

export const 表单: Story = {
  render: () => <Demo />,
};
export default meta;
