import { Alert, Button, Col, Divider, Form, Input, List, message, Modal, Row, Select, Space, Spin, Tree } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CandidateAPI from "../../apis/CandidateAPI";
import UploadButton from "../../components/input/UpLoadButton";
import AntTable from "../../components/table/AntTable";
import { DownloadOutlined, EyeOutlined, FilterOutlined, DeleteOutlined } from '@ant-design/icons';

import Chart from "./Chart";

export default function ThongKe() {
  const [filterOption, setFilterOption] = useState({
    khoa_start: new Date().getFullYear(),
    khoa_end: '',
    mode: 'khoa-tuyen-sinh', // or 'dot-tuyen-sinh' or 'nganh'
    khoa_tuyen_sinh: '',
    dot_tuyen_sinh: '',
    nganh: '',
  })
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Row>
        <Space>
          <Button type="primary" icon={<FilterOutlined />} onClick={() => { }}>DownLoad</Button>
        </Space>
      </Row>
      <Divider />
      <Row>
        <Chart {...filterOption}/>
      </Row>
    </div>
  )


}