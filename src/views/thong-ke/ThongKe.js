import { Alert, Button, Col, DatePicker, Divider, Form, Input, List, message, Modal, Row, Select, Space, Spin, Tree } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CandidateAPI from "../../apis/CandidateAPI";
import UploadButton from "../../components/input/UpLoadButton";
import AntTable from "../../components/table/AntTable";
import { DownloadOutlined, EyeOutlined, FilterOutlined, DeleteOutlined } from '@ant-design/icons';

import Chart from "./Chart";
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
export default function ThongKe() {
  const [filterOption, setFilterOption] = useState({
    khoa_start: 0,
    khoa_end: new Date().getFullYear(),
    mode: 'khoa-tuyen-sinh', // or 'dot-tuyen-sinh' or 'nganh'
    khoa_tuyen_sinh: '',
    dot_tuyen_sinh: '',
    nganh: '',
  })
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const columns = [
    {
      title: 'Khoá tuyển sinh',
      dataIndex: 'khoa_tuyen_sinh',

    }, {
      title: 'Số lượng Đợt tuyển sinh',
      dataIndex: 'so_luong_dot_tuyen_sinh',
    }, {
      title: 'Số lượng ngành',
      dataIndex: 'so_luong_nganh',

    },
    {
      title: 'Số lượng thí sinh',
      dataIndex: 'so_luong_thi_sinh',
    },
    {
      title: 'Số lượng thí sinh trúng tuyển',
      dataIndex: 'so_luong_thi_sinh_dat',
    }
  ]

  return (
    <div>
      <Row>
        <Space>
          <Form

            name="basic"
            labelCol={{
              span: 14,
            }}
            wrapperCol={{
              span: 10,
            }}
            initialValues={{
              remember: true,
            }}
            className="form-1"
            onValuesChange={(data) => {
              // console.log('data :>> ',);
              
              setFilterOption({
                ...filterOption,
                khoa_end:  data.hoa_end?._d.getFullYear() || new Date().getFullYear(),
                khoa_start: data.khoa_start?._d.getFullYear() || 0});
            }}
            style={{width: '100%'}}
            autoComplete="off"
          >
            <Form.Item  key={1} name={'khoa_start'} label={'Khoá bắt đầu'} rules={[{ required: true }]}>
              <DatePicker picker="year" />
            </Form.Item>
            <Form.Item key={2} name={'khoa_end'} label={'Khoá kết thúc'} rules={[{ required: true }]}>
              <DatePicker picker="year" />
            </Form.Item>
          </Form>
        </Space>
      </Row>
      <Divider />
      <Row>
        <Chart {...filterOption}/>
      </Row>
      <Row>
        <Space style={{margin:2}}>

          <Button type="primary" icon={<DownloadOutlined />} onClick={() => { }}>DownLoad</Button>
        </Space>

        <AntTable

          columns={columns}
          rows={data}
        />

      </Row>
    </div>
  )


}