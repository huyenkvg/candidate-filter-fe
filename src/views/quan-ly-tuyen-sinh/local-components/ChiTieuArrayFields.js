import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import TuyenSinhAPI from '../../../apis/TuyenSinhAPI';

import { DownloadOutlined, EyeOutlined, DeleteOutlined, PieChartOutlined, EditOutlined } from '@ant-design/icons';
import { FormTaoKhoa } from './FormTaoKhoa';

function showMessage(type, content) {
  switch (type) {
    case 'success':
      message.success(content);
      break;
    case 'error':
      message.error(content);
      break;
    case 'warning':
      message.warning(content);
      break;
    case 'info':
      message.info(content);
      break;
    default:
      break;
  }
}

function SelectToHop({ name, data, keyID, onChange, hidden, ...restField }) {
  console.log('key----------------- :>> ', keyID);

  const [dataModal, setDataModal] = useState({ open: false, typeSubmit: null, prevData: {}, title: '', schema: null });

  const [options, setOptions] = React.useState(data.map(x => ({ value: x.maToHop, label: x.tenToHop })));
  const [selected, setSelected] = React.useState([]);
  const [tiLeToHop, setTiLeToHop] = React.useState(null);
  const [str_tile, set_str_tile] = useState(' Tỉ lệ tự do');

  const handleChange = (value) => {
    setSelected(value);
    //console.log('value :>> ', value);

  };

  const handleClickPie = () => {
    setDataModal({
      ...dataModal, open: true, typeSubmit: 'TILE-TO-HOP', title: 'Cấu hình tỉ lệ tổ hợp - Đặt số lượng cần tuyển mỗi tổ hợp',
      schema: selected.map(x => ({
        title: x,
        dataIndex: x,
        key: x,
        type: 'number',
      })),
      prevData: { ...tiLeToHop }
    });

  }
  const handleOk = () => {
  }
  const handleCancel = () => {
    setDataModal({ ...dataModal, open: false });
  }
  const onTILeChange = (formValues, type) => {
    setDataModal({ ...dataModal, open: false });
    if (formValues) {
      let str = '';
      for (const key in formValues) {
        str += key + ': ' + formValues[key] + ' , ';
      }
      set_str_tile(str);
    }
    else {
      set_str_tile(' Tỉ lệ tự do');
    }


    setTiLeToHop(formValues);
    //console.log('formValues :>> ', formValues);

  }
  useEffect(() => {
    onChange(tiLeToHop);
  }, [tiLeToHop]);
  return (<>
    <Form.Item
      {...restField}
      name={[name, 'maToHop']}
      rules={[
        {
          required: false,
          message: 'Missing maToHop',
        },
      ]}
    >
      <Select
        mode="multiple"
        placeholder="Please select"
        defaultValue={[]}
        onChange={handleChange}
        style={{ width: '200px' }}
        options={options}
      />

    </Form.Item>
    {selected.length > 0 && str_tile}
    <Button onClick={handleClickPie} hidden={selected.length == 0 || hidden} type="primary" icon={<PieChartOutlined />} >chia tổ hợp</Button>
    <Modal title={dataModal.title} open={dataModal.open} footer={false} style={{ padding: '5px' }} onCancel={handleCancel}>
      <FormTaoKhoa onOk={handleOk} prevValues={dataModal.prevData} onCancel={handleCancel} onSubmit={(form) => onTILeChange(form, dataModal.typeSubmit)} schema={dataModal.schema || []} />
    </Modal>
  </>
  )

}




const ChiTieuArrayFields = ({ submitChiTieu , existNganh}) => {
  const [nganh, setNganh] = React.useState({});
  const [dsToHop, setDsToHop] = React.useState([]);
  const [options, setOptions] = React.useState([]);
  const [selectedOption, setSelectedOption] = React.useState({});
  const [chiTieu, setChiTieu] = React.useState({});
  const [finalValue, setFinalValue] = React.useState({});

  useEffect(() => {
    TuyenSinhAPI.getDanhSachToHopXetTuyen().then((res) => {
      setDsToHop(res.data);
    })
    TuyenSinhAPI.getDanhSachNganh().then((res) => {
      let arr = res.data.filter(x => !existNganh.includes(x.maNganh));
      setNganh(arr.reduce((acc, cur) => {
        acc[cur.maNganh] = cur.tenNganh;
        return acc;
      }, {}));
      setOptions(arr.map((item) => ({ label: `${item.tenNganh} - ${item.maNganh}`, value: item.maNganh })));

    });

  }, [existNganh])
  // on selections change
  const onSelectionsChange = (key, value) => {
    //console.log('key :>> ', key);
    //console.log('selectedOption :>> ', selectedOption);
    if (!value) { // bỏ chọn 1 ngành
      if (selectedOption[key]) { // trả lại vào array
        setOptions(options.concat({ label: `${selectedOption[key]} - ${nganh[selectedOption[key]]}`, value: selectedOption[key] }));
      }
      setSelectedOption({ ...selectedOption, [key]: null }); // set null

    } // chọn 1 ngành
    else if (!selectedOption[key]) { // trước đó có 0 có ngành được chọn 
      setSelectedOption({ ...selectedOption, [key]: value }); // lấy vào ds chọn
      setOptions(options.filter((item) => item.value !== value)); // bỏ ra khỏi ds lựa
    }
    else { // trước đó đã có 1 ngành được chọn
      const x = selectedOption[key]; // lưu gtri cũ
      setSelectedOption({ ...selectedOption, [key]: value }); // set giá trị mới chọn 
      // trả lại cũ vào array và bỏ ngành mới chọn ra khỏi array
      setOptions(options.filter((item) => item.value !== value).concat({ label: `${x} - ${nganh[x]}`, value: x })); // bỏ ra khỏi ds lựa, thêm vào ds lựa

    }

  };
  // onTiLeToHopChange
  const onTiLeToHopChange = (key, value) => {
    setFinalValue({ ...finalValue, chiTieuToHop: { ...finalValue.chiTieuToHop, [key]: value } });
  }
  const onFinish = (values) => {
    setFinalValue({ ...finalValue, chiTieuNganh: values.chiTieuNganh });
    let chiTieuToHop = {}
    Object.keys(finalValue.chiTieuToHop).forEach((key) => {
      if (nganh[key]) {
        chiTieuToHop[key] = finalValue.chiTieuToHop[key];
      }
    }
    )
    let data = {chiTieuToHop, chiTieuNganh: values.chiTieuNganh }
    submitChiTieu(data)
  };
  return (
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      <Form.List name="chiTieuNganh">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{
                  display: 'flex',
                  marginBottom: 8,
                }}
                align="baseline"
              >
                <Form.Item
                  {...restField}
                  name={[name, 'maNganh']}
                  rules={[
                    {
                      required: true,
                      message: 'Missing maNganh name',
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn Ngành"
                    onChange={e => onSelectionsChange(key, e)}
                    allowClear
                    style={{ width: '300px' }}
                  >
                    {options.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'chiTieu']}
                  rules={[
                    {
                      required: true,
                      message: 'Chỉ tiêu không hợp lệ, chỉ tiêu > 0 và bằng tổng chỉ tiêu của các tổ hợp nếu có',
                      validator: (_, value) => {
                        if (!value || value <= 0) {
                          return Promise.reject(new Error('Chi tiêu tuyển không được nhỏ hơn 1'));
                        }

                        if (selectedOption[key]) {
                          console.log('finalValue.chiTieuToHop[selectedOption[key]] :>> ', finalValue.chiTieuToHop[selectedOption[key]]);
                          if (finalValue.chiTieuToHop[selectedOption[key]]) {
                            let sum = Object.values(finalValue.chiTieuToHop[selectedOption[key]]).reduce((acc, cur) => acc + Number.parseInt(cur), 0);
                            console.log('sum :>> ', sum);
                            if (sum != value) {
                              return Promise.reject(new Error('Chi tiêu tuyển không được khác tổng chi tiêu của các tổ hợp'));

                            }
                          }


                        }

                        return Promise.resolve();
                      }
                    },
                  ]}
                >
                  <Input placeholder="Chỉ tiêu tuyển" />
                </Form.Item>
                <SelectToHop name={name} data={dsToHop} keyID={key} hidden={!selectedOption[key]} onChange={v => onTiLeToHopChange(selectedOption[key], v)} {...restField} />
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item hidden={options.length == 0}>
              <h4> hoặc </h4>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Thêm Ngành Tuyển
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item hidden={Object.keys(selectedOption).length == 0 || options.length == Object.keys(nganh).length}>
        <Button type="primary" htmlType="submit">
          OK
        </Button>
      </Form.Item>
    </Form>
  );
};
export default ChiTieuArrayFields;