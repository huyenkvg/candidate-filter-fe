import { Alert, Button, Col, Divider, Input, List, message, Modal, Row, Space, Spin, Tree } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CandidateAPI from "../../../apis/CandidateAPI";
import TuyenSinhAPI from "../../../apis/TuyenSinhAPI";
import UploadButton from "../../../components/input/UpLoadButton";
import AntTable from "../../../components/table/AntTable";
import { addDotTuyenSinh, addKhoaTuyenSinh, removeDotTuyenSinh, removeKhoaTuyenSinh, setDanhSachKhoaTuyenSinh, updateDotTuyenSinh, updateKhoaTuyenSinh } from "../../../features/QuanLyTuyenSinh/tuyenSinhSlice";
import { setDanhSachCandidate } from "../../../features/ThiSinh/candidateSlice";
import { DownloadOutlined, EyeOutlined, DeleteOutlined, EditOutlined, PlusOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Navigate, useNavigate } from "react-router-dom";
import Complextable from "../../../components/table/ComplexTable";
import { FormTaoKhoa } from "../local-components/FormTaoKhoa";
import SearchBar from "../local-components/SearchBar";
import YearPicker from "../../../components/input/YearPicker";



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

  const dot_tuyen_sinh_columns =
    [
      {
        title: 'Đợt tuyển sinh',
        dataIndex: 'tenDotTuyenSinh',
        key: 'tenDotTuyenSinh',

        render: (text, record) => (<Space >
          <Button type="text" onClick={() => { if (!record.lock) navigate(`/dot-tuyen-sinh/${record.maDotTuyenSinh}`) }}><> {`Đợt ${record.index} - ${record.tenDotTuyenSinh}`} </></Button>
          <Button type="link" danger={record.lock} onClick={() => { handleClick(record, 'LOCK-DOT-TUYENSINH') }}>{record.lock ? <LockOutlined /> : <UnlockOutlined />}</Button>
        </Space>)
      },
      {
        title: 'action',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) =>
          <Space>
            <Button type="primary" ghost size='small' onClick={() => { handleClick(record, 'MINI-VIEW-XETTUYEN') }}
              icon={<EyeOutlined />}
            >DS xét tuyển</Button>
            <Button type="primary" ghost size='small' onClick={() => { handleClick(record, 'MINI-VIEW-TRUNGTUYEN') }}
              icon={<EyeOutlined />}
            >DS trúng tuyển</Button>
            <Button type="primary" ghost size='small' onClick={() => { handleClick(record, 'MINI-EDIT-ROW') }}
              icon={<EditOutlined />}>Sửa Tên</Button>
            <Button disabled={record.count_trung_tuyen > 0} danger type="default" size='small' onClick={() => { handleClick(record, 'MINI-DELETE-ROW') }}
              icon={<DeleteOutlined />}
            >Xoá</Button>
          </Space>
      }
    ];
  const khoa_columns = [
    {
      title: 'Tên khoá',
      dataIndex: 'tenKhoa',
      key: 'tenKhoa',
      type: 'year',
      render: (text, record) => (
        <Button type="link" >{text}</Button>
      )
    },
    {
      title: 'Số đợt tuyển sinh',
      dataIndex: 'count_dot_tuyen_sinh',
      key: 'count_dot_tuyen_sinh',
      render: (text, record) => (<Space>
        <Button type="link" onClick={() => { navigate() }}>{text}</Button>
        <Button type="text" onClick={() => { handleClick(record, "CREATE-MINI-ROW") }} icon={<PlusOutlined />} >Add</Button>
      </Space>
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
          <Button type='primary' size='small' onClick={() => handleClick(record, 'VIEW-ROW')}
            icon={<EyeOutlined />}
          >DS trúng tuyển</Button>
          {/* <Button type="primary" shape="circle" size="small" icon={<DownloadOutlined />} onClick={() => handleClick(record, 'VIEW-ROW')} loading={loading} /> */}
          {/* <Button type='primary' size="small" onClick={() => handleClick(record, 'EDIT-ROW')} icon={<EditOutlined />}  >Sửa Tên</Button> */}
          <Button danger type='primary' size="small" onClick={() => handleClick(record, 'DELETE-ROW')} icon={<DeleteOutlined />}>Xóa</Button>
        </Space>
      ),
    },
  ]


  //Hàm xly Sự Kiện
  const handleClick = (record, type) => {
    console.log(record, type);
    switch (type) {
      case 'EDIT-ROW':
        // setDataModal({ ...dataModal, prevData: record })
        // console.log('record :>> ', record);
        showDialogModal('EDIT-KHOATUYENSINH', [khoa_columns[0],], "Sửa Khoá Tuyển Sinh", record)
        // console.log(record, type);
        break;
      case 'DELETE-ROW':
        handleSubmit(record, 'DELETE-KHOATUYENSINH')
        // handleDelete(record);
        break;
      case 'VIEW-ROW':
        // console.log(record);
        break;
      case 'CREATE-MINI-ROW':
        showDialogModal('CREATE-DOTTUYENSINH', [dot_tuyen_sinh_columns[0]], `Thêm Đợt Tuyển Sinh Khoá ${record.tenKhoa}`, { maKhoaTuyenSinh: record.maKhoa });
        break;
      case 'MINI-EDIT-ROW':
        // console.log(record);
        showDialogModal('EDIT-DOTTUYENSINH', [dot_tuyen_sinh_columns[0]], "Sửa Đợt Tuyển Sinh", record)
        break;
      case 'MINI-DELETE-ROW':
        handleSubmit(record, 'DELETE-DOTTUYENSINH')
        // console.log(record);
        break;
      case 'MINI-VIEW-XETTUYEN':
        // console.log(record);
        break;
      case 'MINI-VIEW-TRUNGTUYEN':
        
        // console.log(record);
        break;
      case 'LOCK-DOT-TUYENSINH':
        let { danh_sach_trung_tuyen, ...x } = record;
        handleSubmit({ ...x, lock: !x.lock }, 'EDIT-DOTTUYENSINH')
      default:
        break;
    }
  }

  // Form Submit
  const [dataModal, setDataModal] = useState({ open: false, typeSubmit: null, prevData: {}, title: '', schema: null });
  const showDialogModal = (typeSubmit, schema, title, prevData) => {
    setDataModal({ ...dataModal, open: true, typeSubmit: typeSubmit, title: title, schema: schema, prevData: prevData });
  };
  const handleOk = () => {
    setDataModal({ ...dataModal, open: false, typeSubmit: null, prevData: {} });
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
  const handleSubmit = (formValues, type) => {
    setLoading(true);
    console.log('formValues :>> ', formValues);
    switch (type) {
      case 'CREATE-KHOATUYENSINH':
        let nienKhoa = new Date(formValues.tenKhoa).getFullYear();
        TuyenSinhAPI.createKhoaTuyenSinh({tenKhoa: nienKhoa }).then((res) => {
          showMessage('success', 'Tạo khoá tuyển sinh thành công');
          dispatch(addKhoaTuyenSinh(res.data));
        }).catch((err) => {
          showMessage('error', 'Tạo khoá tuyển sinh thất bại');
        }).finally(() => {
          setLoading(false);
        })
        break;
      case 'EDIT-KHOATUYENSINH':
        let { maKhoa, tenKhoa } = formValues;
        TuyenSinhAPI.updateKhoaTuyenSinh({ maKhoa, tenKhoa }).then((res) => {
          showMessage('success', 'Sửa khoá tuyển sinh thành công');
          dispatch(updateKhoaTuyenSinh({ ...formValues, ...res.data }));
        }).catch((err) => {
          showMessage('error', 'Sửa khoá tuyển sinh thất bại');
        }).finally(() => {
          setLoading(false);
        })
        break;
      case 'DELETE-KHOATUYENSINH':
        TuyenSinhAPI.deleteKhoaTuyenSinh(formValues).then((res) => {
          showMessage('success', 'Xóa khoá tuyển sinh thành công');
          dispatch(removeKhoaTuyenSinh(formValues));
        }).catch((err) => {
          showMessage('error', 'Xóa khoá tuyển sinh thất bại');
        }).finally(() => {
          setLoading(false);
        })
        break;
      case 'CREATE-DOTTUYENSINH':
        TuyenSinhAPI.createDotTuyenSinh({ ...formValues, maKhoaTuyenSinh: dataModal.prevData.maKhoaTuyenSinh }).then((res) => {
          showMessage('success', 'Thêm đợt tuyển sinh thành công');
          dispatch(addDotTuyenSinh(res.data));
        }).catch((err) => {
          showMessage('error', 'Thêm đợt tuyển sinh thất bại');
        }).finally(() => {
          setLoading(false);
        })
        break;
      case 'EDIT-DOTTUYENSINH': {
        let { index, stt, ...dataUpdate } = formValues;
        TuyenSinhAPI.updateDotTuyenSinh(dataUpdate).then((res) => {
          showMessage('success', 'Sửa đợt tuyển sinh thành công');
          dispatch(updateDotTuyenSinh({ ...formValues, ...res.data }));
        }).catch((err) => {
          showMessage('error', 'Sửa đợt tuyển sinh thất bại');
          console.log('err :>> ', err);
        }).finally(() => {
          setLoading(false);
        })
      }
        break;
      case 'DELETE-DOTTUYENSINH':
        TuyenSinhAPI.deleteDotTuyenSinh(formValues).then((res) => {
          showMessage('success', 'Xóa đợt tuyển sinh thành công');
          dispatch(removeDotTuyenSinh(formValues));
        }).catch((err) => {
          console.log('err :>> ', err);
          showMessage('error', 'Xóa đợt tuyển sinh thất bại');
        }).finally(() => {
          setLoading(false);
        })
        break
      default:
        break;

    }
    setDataModal({ ...dataModal, open: false });
  };
  const handleCancel = (isPending) => {
    setDataModal({ ...dataModal, open: false, typeSubmit: null, prevData: isPending ? dataModal.prevData : {} });
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
            <Button onClick={() => showDialogModal('CREATE-KHOATUYENSINH', [khoa_columns[0]], "Thêm Khoá Tuyển Sinh")} >Thêm Khoá Tuyển Sinh</Button>
            <SearchBar onSearching={e => { }} label="Tìm Kiếm Khoá Tuyển Sinh" />
          </Space>
        </Row>
        <Row>
          <Col span={24}>
            {/* <AntTable columns={khoa_columns} rows={tuyenSinhState.list_khoa_ts} loading={loading} /> */}
            <Complextable columns={khoa_columns} child_columns={dot_tuyen_sinh_columns} data={dataTable} />
          </Col>
        </Row>
      </Spin>
      <Modal title={dataModal.title} open={dataModal.open} footer={false} style={{ padding: '5px' }} onCancel={handleCancel}>
        <FormTaoKhoa onOk={handleOk} prevValues={dataModal.prevData} onCancel={handleCancel} onSubmit={(form) => handleSubmit(form, dataModal.typeSubmit)} schema={dataModal.schema || []} />
      </Modal>
    </div >
  );
}