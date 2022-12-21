import { Alert, Button, Col, Divider, Input, List, message, Modal, Row, Select, Space, Spin, Tree } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { DownloadOutlined, EyeOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import SearchBar from "../quan-ly-tuyen-sinh/local-components/SearchBar";
import AntTable from "../../components/table/AntTable";
import { FormTaoKhoa } from "../quan-ly-tuyen-sinh/local-components/FormTaoKhoa";
import AuthAPI from "../../apis/AuthAPI";
import TuyenSinhAPI from "../../apis/TuyenSinhAPI";
import FileAPI from "../../apis/FileAPI";

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


export default function HoSoTuyenSinh() {
  const [openConfirm, setOpenConfirm] = useState({
    open: false,
    title: '',
    record: {},
    typeSubmit: "DELETE-ALL-HO-SO",
  });
  const [loading, setLoading] = useState(true);
  const [dataHoSo, setDataHoSo] = useState(null);
  const [dataModal, setDataModal] = useState({ open: false, typeSubmit: null, prevData: {}, title: '', schema: null });
  const [params, setParams] = useState({  info: '',  maKhoaTuyenSinh: 'all' });
  const [dataKhoa, setDataKhoa] = useState([]);

  const showDialogModal = (typeSubmit, schema, title, prevData) => {
    setDataModal({ ...dataModal, open: true, typeSubmit: typeSubmit, title: title, schema: schema, prevData: prevData });
  };
  const handleSubmit = (formValues, type) => {
    setLoading(true);
    console.log('formValues :>> ', formValues);
    switch (type) {
      case 'CREATE-HO-SO':
        AuthAPI.createHoSo(formValues)
          .then((res) => {
            showMessage('success', 'Tạo Hồ sơ công');
            setDataModal({ ...dataModal, open: false });
            setDataHoSo(dataHoSo.push(res.data));
            setLoading(false);
          }).catch((err) => {
            setLoading(false);
            showMessage('error', 'Tạo Hồ sơ thất bại, Mã HoSo đã tồn tại');
          });
        break;
      case 'EDIT-HO-SO':
        let { maHoSo, tenHoSo } = formValues;
        // TuyenSinhAPI.updateHoSo({ maHoSo, tenHoSo })
        //   .then((res) => {
        //     showMessage('success', 'Cập nhật Hồ sơ công');
        //     setDataHoSo(dataHoSo.map((item) => {
        //       if (item.maHoSo == maHoSo) {
        //         return { ...item, tenHoSo }
        //       }
        //       return item;
        //     }))
        //     setLoading(false);
        //     setDataModal({ ...dataModal, open: false });
        //   })

        break;
      case 'DELETE-HO-SO':
        // TuyenSinhAPI.deleteHoSo({ maHoSo: formValues.maHoSo })
        //   .then((res) => {
        //     showMessage('success', 'Xóa Hồ sơ công');
        //     setDataHoSo(dataHoSo.filter((item) => item.maHoSo != formValues.maHoSo))
        //     setLoading(false);
        //   }).catch((err) => {
        //     showMessage('error', 'Xóa Hồ sơ thất bại');
        //     setLoading(false);
        //   })


        break;
      case 'DELETE-ALL-HO-SO':
        setOpenConfirm({ ...openConfirm, open: false });
        TuyenSinhAPI.deleteAllHoSo(formValues.maKhoaTuyenSinh)
          .then((res) => {
            showMessage('success', 'Xóa Hồ sơ công');
            setLoading(false);
          }).catch((err) => {
            showMessage('error', 'Xóa Hồ sơ thất bại');
            setLoading(false);
          })
      default:
        break;

    }
    setDataModal({ ...dataModal, open: false });
  };
  const handleCancel = (isPending) => {
    setDataModal({ ...dataModal, open: false, typeSubmit: null, prevData: isPending ? dataModal.prevData : {} });
  };
  const handleClick = (record, type) => {
    console.log(record, type);
    switch (type) {
      case 'EDIT-ROW':
        // setDataModal({ ...dataModal, prevData: record })
        // console.log('record :>> ', record);
        setDataModal({ open: true, typeSubmit: 'EDIT-HO-SO', prevData: record, title: 'Sửa HoSo', schema: columns.slice(1, 7) });
        // console.log(record, type);
        break;
      case 'DELETE-ROW':
        handleSubmit(record, 'DELETE-HO-SO')
        // handleDelete(record);
        break;

      default:
        break;
    }
  }

  const handleOk = () => {
    setDataModal({ ...dataModal, open: false, typeSubmit: null, prevData: {} });
  };
  const columns = [
    {
      title: 'Số Báo Danh',
      dataIndex: 'soBaoDanh',
      key: 'soBaoDanh',
      width: 170,
    },
    {
      title: 'Họ Tên',
      dataIndex: 'hoTen',
      key: 'maHoSo',
      width: 170,
    },
    {
      title: 'CMND',
      dataIndex: 'cmnd',
      key: 'soDienThoai',
      width: 150,

    },
    {
      title: 'Giới Tính',
      dataIndex: 'gioiTinh',
      key: 'gioiTinh',
      width: 150,

    },
    {
      title: 'Ngày Sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 150,

    },
    {
      title: 'Số Điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },

    {
      title: 'action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) =>
        <Space>
          <Button type="primary" ghost size='small' onClick={() => { handleClick(record, 'EDIT-ROW') }}
            icon={<EditOutlined />}>Sửa</Button>
          <Button disabled={record.count_trung_tuyen > 0} danger type="default" size='small' onClick={() => { handleClick(record, 'DELETE-ROW') }}
            icon={<DeleteOutlined />}
          >Xoá</Button>
        </Space>
    }
  ]
  const fetchData = () => {
    setLoading(true);
    TuyenSinhAPI.getDanhSachHoSo(params).then((res) => {
      setDataHoSo(res.data);
      setLoading(false);
    }).catch((err) => {
      console.log(err);
      setLoading(false);
    })
  }

  useEffect(() => {
    fetchData();
  }, [params])
  useEffect(() => {
    TuyenSinhAPI.getDanhSachKhoaTuyenSinh(true).then((res) => {
      setDataKhoa(res.data.map((item) => ({ label: item.tenKhoa, value: item.maKhoa })).concat({ value: 'all', label: 'Tất cả'}));
    })
    TuyenSinhAPI.getDanhSachHoSo(params).then((res) => {
      setDataHoSo(res.data);
      setLoading(false);
    }).catch((err) => {
      console.log(err);
      setLoading(false);
    })

  }, []);
  const handleChangeKhoa = (value) => {
    console.log(value);
    setParams({ ...params, maKhoaTuyenSinh: value });
  }

  const onSearching = (value) => {
    console.log('value search :>> ', value);
    setParams({ ...params, info: value });
  }

  return (

    <div style={{ overflowX: 'scroll' }}>
      <Spin spinning={loading} >
        <Row style={{ justifyContent: 'right', marginBottom: '10px' }}>
          <Space> 
            Chọn Khoá
            <Select
              defaultValue={'all'}
              placeholder="Please select"
              onChange={handleChangeKhoa}
              // value={params.maKhoaTuyenSinh}
              style={{ width: '200px'}}
              options={dataKhoa}
            />
            {params.maKhoaTuyenSinh !== 'all' && <> <Button type="default" danger icon={<DeleteOutlined />} onClick={() => {
              setOpenConfirm({
                open: true,
                record: { maKhoaTuyenSinh: params.maKhoaTuyenSinh },
                title: `Loại Bỏ các hồ sơ không có nguyện vọng nào của khoá ${dataKhoa.find((item) => item.value == params.maKhoaTuyenSinh).label}`,
                typeSubmit: 'DELETE-ALL-HO-SO',

              })
            }} > Clear Hồ Sơ Rác</Button> 
            <Button type="primary" icon={<DownloadOutlined />} onClick={() => {
              FileAPI.getExcelFileOf('DS-HO-SO', params.maKhoaTuyenSinh)
            }} > Xuất Excel</Button></>}

            <Button onClick={() => showDialogModal('CREATE-HO-SO', columns.slice(0, 7), "Thêm HoSo")} > Thêm HoSo</Button>
            <SearchBar label="Tìm Kiếm Thí Sinh" onSearching={onSearching}/>
           
          </Space>
        </Row>
        {dataHoSo && !loading &&
          <Row>
            <Col span={24}>
              <AntTable columns={columns} rows={dataHoSo} loading={loading} />
            </Col>
          </Row>}
        <Modal title={dataModal.title} open={dataModal.open} footer={false} style={{ padding: '5px' }} onCancel={handleCancel}>
          <FormTaoKhoa onOk={handleOk} prevValues={dataModal.prevData} onCancel={handleCancel} onSubmit={(form) => handleSubmit(form, dataModal.typeSubmit)} schema={dataModal.schema || []} />
        </Modal>
        {openConfirm.open && <Modal open={openConfirm.open} title={openConfirm.title} style={{ padding: '5px' }} onOk={() => handleSubmit(openConfirm.record, openConfirm.typeSubmit)} onCancel={() => {
          setOpenConfirm({
            ...openConfirm, open: false,
          })
        }} />}
      </Spin>
    </div>
  )
}