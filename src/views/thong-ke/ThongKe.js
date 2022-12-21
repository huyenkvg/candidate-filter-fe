import { Alert, Button, Col, DatePicker, Divider, Form, Input, List, message, Modal, Row, Select, Space, Spin, Tree } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CandidateAPI from "../../apis/CandidateAPI";
import UploadButton from "../../components/input/UpLoadButton";
import AntTable from "../../components/table/AntTable";
import { DownloadOutlined, EyeOutlined, FilterOutlined, DeleteOutlined } from '@ant-design/icons';

import Chart from "./Chart";
import ThongKeAPI from "../../apis/ThongKeAPI";
import { Excel } from "antd-table-saveas-excel";
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
      dataIndex: 'tenKhoa',
      key: 'tenKhoa',
      width: 170,


    }, {
      title: 'Số lượng Đợt tuyển sinh',
      dataIndex: 'count_dot_tuyen_sinh',
      key: 'count_dot_tuyen_sinh',
      width: 170,
    },
    {
      title: 'Số lượng ngành',
      dataIndex: 'count_nganh',
      key: 'count_nganh',
      width: 170,
      // render: (text, record) => {
      //   return <p>{text.count_nganh}</p>
      // }

    },
    {
      title: 'Số lượng nguyện vọng',
      dataIndex: 'count_nguyen_vong',
      key: 'count_nguyen_vong',
      width: 170,
    },
    {
      title: 'Số lượng thí sinh trúng tuyển',
      dataIndex: 'count_trung_tuyen',
      key: 'count_trung_tuyen',
      width: 170,
    },
    {
      title: 'Số lượng sinh viên nhập học',
      dataIndex: 'count_nhap_hoc',
      key: 'count_nhap_hoc',
      width: 170,
    },
    {
      title: 'Tỉ lệ trúng tuyển',
      dataIndex: 'tile_trung_tuyen',
      key: 'tile_trung_tuyen',
      width: 170,
    },
    {
      title: 'Tỉ lệ nhập học',
      dataIndex: 'tile_nhap_hoc',
      key: 'tile_nhap_hoc',
      width: 170,
    },
  ]
  const onGetData = (data) => {
    // console.log('data huyen kute :>> ', data);
    // setData(data);
  }
  useEffect(() => {
    ThongKeAPI.getTableThongKe(filterOption).then((res) => {
      setData(res.data.map(x => ({
        ...x,
        key: x.id,
        tile_trung_tuyen: `${(x.count_trung_tuyen / x.count_nguyen_vong * 100).toFixed(2)}%`,
        tile_nhap_hoc: `${(x.count_nhap_hoc / x.count_trung_tuyen * 100).toFixed(2)}%`,


























































































































































































































































































































































































































































        
      })));
      // console.log('HUHUHUHUHUHUUUH :>> ', res.data);
    })
  }, [filterOption])


  const onClickDown = (columns, dataSource) => {

    const excel = new Excel();
    excel
      .addSheet("Mini")
      .addColumns(columns)
      .addDataSource(dataSource, {
        str2Percent: true
      })
      .saveAs(`ThongKe-${filterOption.khoa_start}-${filterOption.khoa_end}.xlsx`);
  };

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
                khoa_end:  data.khoa_end?._d.getFullYear() || filterOption.khoa_end || data.khoa_start?._d.getFullYear() || new Date().getFullYear(),
                khoa_start: data.khoa_start?._d.getFullYear() || filterOption.khoa_start || data.khoa_end?._d.getFullYear() || new Date().getFullYear()});
            }}
            style={{width: '100%'}}
            autoComplete="off"
          >
            <Form.Item  key={1} name={'khoa_start'} label={'Khoá bắt đầu'} rules={[{ required: true }]}>
              <DatePicker picker="year" value={filterOption.khoa_start} />
            </Form.Item>
            <Form.Item key={2} name={'khoa_end'} label={'Khoá kết thúc'} rules={[{ required: true }]}>
              <DatePicker picker="year"   value={filterOption.khoa_end}/>
            </Form.Item>
          </Form>
        </Space>
      </Row>
      <Divider />
      <Row>
        <Chart {...filterOption} onGetData={onGetData}/>
      </Row>
      <Row>
        <Space style={{margin:2}}>

          <Button type="primary" icon={<DownloadOutlined />} onClick={() => { onClickDown(columns, data) }}>DownLoad</Button>
        </Space>

        {data.length > 0 && <AntTable
          columns={columns}
          rows={data}
        />}

      </Row>
    </div>
  )


}