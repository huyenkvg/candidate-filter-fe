import { Button, DatePicker, Form, Input, Select } from 'antd';
import React, { useEffect, useRef } from 'react';
const { Option } = Select;
const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

export function FormTaoKhoa({schema, onSubmit, prevValues, onCancel, onOk}) {
  const [formValues, setFormValues] = React.useState(prevValues || {});
  const formRef = useRef();
  const onFinish = (values) => {
    // console.log('HIHIHIHIHIHH Values :>> ', values);
    let dataSubmit = {...prevValues, ...values};
    onSubmit(dataSubmit);
    // onOk();
    formRef.current.resetFields();
  };
  const onReset = () => {
    formRef.current.resetFields();
  };
  // const onFill = () => {
  //   formRef.current.setFieldsValue({
  //     tenKhoa: `Khoá Tuyển sinh ${(new Date()).getFullYear()}`,
  //   });
  // };
  useEffect(() => {
    console.log('prevValues :>> ', prevValues);
    setFormValues(prevValues || {});
    formRef?.current?.setFieldsValue({...prevValues})
  }, [prevValues]);
  return (
    <Form {...layout} ref={formRef} name="control-ref" onFinish={onFinish}>
      {
        schema.map((item, index) => {
          if (item.type == 'year') {
            return (
              <Form.Item key={index} name={item.dataIndex} label={item.title} rules={[{ required: true }]}>
                <DatePicker picker="year" />
              </Form.Item>
            )
          }
          return (
            <Form.Item key={index} name={item.dataIndex} label={item.title}  rules={[{ required: true }]}>
              <Input   type={item.type || 'text'} />
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
          OK
        </Button>
        {/* <Button htmlType="button" onClick={onReset}>
            Reset
          </Button> */}
        {/* <Button type="link" htmlType="button" onClick={onFill}>
          Fill form
        </Button> */}
      </Form.Item>
    </Form>
  );

}