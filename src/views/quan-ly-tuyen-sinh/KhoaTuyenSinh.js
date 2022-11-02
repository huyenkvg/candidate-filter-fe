import { Alert, Button, Col, Divider, Input, List, message, Modal, Row, Space, Spin, Tree } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CandidateAPI from "../../apis/CandidateAPI";
import TuyenSinhAPI from "../../apis/TuyenSinhAPI";
import UploadButton from "../../components/input/UpLoadButton";
import AntTable from "../../components/table/AntTable";
import { addKhoaTuyenSinh, removeKhoaTuyenSinh, setDanhSachKhoaTuyenSinh } from "../../features/QuanLyTuyenSinh/tuyenSinhSlice";
import { setDanhSachCandidate } from "../../features/ThiSinh/candidateSlice";
import { DownloadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Navigate, useNavigate } from "react-router-dom";
import Complextable from "../../components/table/ComplexTable";
import { FormTaoKhoa } from "./local-components/FormTaoKhoa";
import SearchBar from "./local-components/SearchBar";



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

export default function KhoaTuyenSinh() {
  // Khai báo
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({})
  const [dataTable, setDataTable] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tuyenSinhState = useSelector((state) => state.tuyenSinh);

  const child_columns =
    [
      {
        title: 'Đợt tuyển sinh',
        dataIndex: 'tenDotTuyenSinh',
        key: 'tenDotTuyenSinh',
        render: (text, record) =>
          <> {`Đợt ${record.index} - ${record.tenDotTuyenSinh}`} </>
      },
      {
        title: 'action',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) =>
          <Space>
            <Button type="default" size='small' onClick={() => { }}
              icon={<EyeOutlined />}
            >DS trúng tuyển</Button>
            <Button type="default" size='small' onClick={() => { }}
            >Sửa</Button>
            <Button type="default" size='small' onClick={() => { }}
              icon={<DeleteOutlined />}
            ></Button>
          </Space>
      }
    ];
  const khoa_columns = [
    {
      title: 'Tên khoá',
      dataIndex: 'tenKhoa',
      key: 'tenKhoa',
      render: (text, record) => (
        <Button type="link" onClick={() => { navigate(`/khoa-tuyen-sinh/${record.maKhoa}`) }}>{text}</Button>
      )
    },
    {
      title: 'Số đợt tuyển sinh',
      dataIndex: 'count_dot_tuyen_sinh',
      key: 'count_dot_tuyen_sinh',
      render: (text, record) => (
        <Button type="link" onClick={() => { navigate() }}>{text}</Button>
      )
    },
    {
      title: 'Số lượng trúng tuyển',
      dataIndex: 'count_trung_tuyen',
      key: 'scount_trung_tuyen',
      render: (text, record) => (
        <Space>
          {text}
          {/* <Button type="text" size="small" shape="circle" icon={<EyeOutlined />} onClick={() => handleClick(record, 'VIEW-ROW')} loading={loading} /> */}
          {/* <Button type="text" size="small" shape="circle" icon={<DownloadOutlined />} onClick={() => handleClick(record, 'VIEW-ROW')} loading={loading} /> */}
        </Space>
      )
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',

      render: (text, record) => (
        <Space>
          <Button type='primary' size='small' onClick={() => { }}
            icon={<EyeOutlined />}
          >DS trúng tuyển</Button>
          {/* <Button type="primary" shape="circle" size="small" icon={<DownloadOutlined />} onClick={() => handleClick(record, 'VIEW-ROW')} loading={loading} /> */}
          <Button type='primary' size="small" onClick={() => handleClick(record, 'EDIT-ROW')} >Sửa</Button>
          <Button type='primary' size="small" onClick={() => handleClick(record, 'DELETE-ROW')} >Xóa</Button>
        </Space>
      ),
    },
  ]


  //Hàm xly Sự Kiện
  const handleClick = (record, type) => {
    switch (type) {
      case 'EDIT-ROW':
        console.log(record);
        break;
      case 'DELETE-ROW':
        handleDelete(record);
        break;
      case 'VIEW-ROW':
        console.log(record);
        break;
      default:
        break;
    }
  }

  // Form Submit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleDelete = (row) => {
    setLoading(true);
    console.log('row :>> ', row);
    TuyenSinhAPI.deleteKhoaTuyenSinh({ id: row.maKhoa }).then(res => {
      if (res.status === 200) {
        showMessage('success', 'Xóa thành công');
        dispatch(setDanhSachKhoaTuyenSinh(tuyenSinhState.list_khoa_ts.filter((item) => item.maKhoa !== row.maKhoa)));
      }
    }).catch(err => {
      showMessage('error', 'Xóa thất bại');
    }).finally(() => {
      setLoading(false);
    })

  }
  const handleSubmit = (formValues) => {
    console.log('formValues :>> ', formValues);
    TuyenSinhAPI.createKhoaTuyenSinh(formValues).then((res) => {
      showMessage('success', 'Tạo khoá tuyển sinh thành công');
      dispatch(addKhoaTuyenSinh(res.data));
    })
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // Effect

  const fetchKhoaTuyenSinh = async () => {
    await TuyenSinhAPI.getAllKhoaTuyenSinh().then(r => {
      dispatch(setDanhSachKhoaTuyenSinh(r.data));
    }).finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    // Lấy danh sách tất cả các khoá
    TuyenSinhAPI.getDanhSachKhoaTuyenSinh().then(
      (res) => {
        dispatch(setDanhSachKhoaTuyenSinh(res.data));
        showMessage('success', 'Lấy danh sách khoá tuyển sinh thành công');
      }
    ).catch(err => {
      showMessage("error", "Lỗi khi lấy danh sách khoá tuyển sinh");
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setDataTable(tuyenSinhState.list_khoa_ts);
  }, [tuyenSinhState].list_khoa_ts);


  return (
    <div style={{ overflowX: 'scroll' }}>
      <Row style={{ textDecoration: 'underline', color: 'orange' }}>
        <h4 style={{ color: 'orange' }}>DANH SÁCH CÁC KHOÁ TUYỂN SINH</h4>
      </Row>

      <Spin spinning={loading} >
        <Row style={{ justifyContent: 'right', marginBottom: '10px' }}>
          <Space>
            <Button onClick={showModal} >Thêm Khoá Tuyển Sinh</Button>
            <SearchBar label="Tìm Kiếm Khoá Tuyển Sinh"/>
            </Space>
        </Row>
        <Row>
          <Col span={24}>
            {/* <AntTable columns={khoa_columns} rows={tuyenSinhState.list_khoa_ts} loading={loading} /> */}
            <Complextable columns={khoa_columns} child_columns={child_columns} data={dataTable} />
          </Col>
        </Row>
      </Spin>
      <Modal title="Thêm Khoá Tuyển Sinh" open={isModalOpen} footer={false} style={{ padding: '5px' }} onCancel={handleCancel}>
        <FormTaoKhoa onOk={handleOk} onCancel={handleCancel} onSubmit={handleSubmit} schema={[khoa_columns[0]]} />
      </Modal>
    </div >
  );
}