import { Button, Form, Input, Select } from 'antd';
import React, { useRef } from 'react';
const { Option } = Select;
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
};

export function FormTaoKhoa({schema, onSubmit, onCancel, onOk}) {
  const formRef = useRef();
  const onFinish = (values) => {
    onSubmit(values);
    // onOk();
    formRef.current.resetFields();
  };
  const onReset = () => {
    formRef.current.resetFields();
  };
  const onFill = () => {
    formRef.current.setFieldsValue({
      tenKhoa: `Khoá Tuyển sinh ${(new Date()).getFullYear()}`,
    });
  };

  return (
    <Form {...layout} ref={formRef} name="control-ref" onFinish={onFinish}>
      {
        schema.map((item, index) => {
          return (
            <Form.Item key={index} name={item.dataIndex} label={item.title} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          )

        })
      }
      {/* <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
      > */}
        {/* {({ getFieldValue }) =>
          getFieldValue('gender') === 'other' ? (
            <Form.Item
              name="customizeGender"
              label="Customize Gender"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          ) : null
        } */}
      {/* </Form.Item> */}
      <Form.Item style={{alignItems: 'right'}}>
        <Button type="primary" htmlType="submit">
          Tạo
        </Button>
        {/* <Button htmlType="button" onClick={onReset}>
            Reset
          </Button> */}
        <Button type="link" htmlType="button" onClick={onFill}>
          Fill form
        </Button>
      </Form.Item>
    </Form>
  );

}