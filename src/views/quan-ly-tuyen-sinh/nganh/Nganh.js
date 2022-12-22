import { Alert, Button, Col, Divider, Input, List, message, Modal, Row, Space, Spin, Tree } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CandidateAPI from "../../../apis/CandidateAPI";
import TuyenSinhAPI from "../../../apis/TuyenSinhAPI";
import AntTable from "../../../components/table/AntTable";

import { DownloadOutlined, EyeOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { FormTaoKhoa } from "../local-components/FormTaoKhoa";
import SearchBar from "../local-components/SearchBar";

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


export default function Nganh() {

  const [loading, setLoading] = useState(true);
  const [dataNganh, setDataNganh] = useState(null);  
  const [filter, setFilter] = useState({ search: '', page: 1, limit: 100 });
  const [dataModal, setDataModal] = useState({ open: false, typeSubmit: null, prevData: {}, title: '', schema: null });
  const showDialogModal = (typeSubmit, schema, title, prevData) => {
    setDataModal({ ...dataModal, open: true, typeSubmit: typeSubmit, title: title, schema: schema, prevData: prevData });
  };
  const handleSubmit = (formValues, type) => {
    setLoading(true);
    console.log('formValues :>> ', formValues);
    switch (type) {
      case 'CREATE-NGANH':
        TuyenSinhAPI.createNganh(formValues)
          .then((res) => {
            showMessage('success', 'Tạo ngành thành công');
            setLoading(false);
            setDataModal({ ...dataModal, open: false });
            setDataNganh([...dataNganh, res.data]);
          }).catch((err) => {
            setLoading(false);
            showMessage('error', 'Tạo ngành thất bại, Mã ngành đã tồn tại');
          });
        break;
      case 'EDIT-NGANH':
        let { maNganh, tenNganh } = formValues;
        TuyenSinhAPI.updateNganh({ maNganh, tenNganh })
          .then((res) => {
            showMessage('success', 'Cập nhật ngành thành công');
            setDataNganh(dataNganh.map((item) => {
              if (item.maNganh == maNganh) {
                return { ...item, tenNganh }
              }
              return item;
            }))
            setLoading(false);
            setDataModal({ ...dataModal, open: false });
          })

        break;
      case 'DELETE-NGANH':
        TuyenSinhAPI.deleteNganh({ maNganh: formValues.maNganh })
          .then((res) => {
            showMessage('success', 'Xóa ngành thành công');
            setDataNganh(dataNganh.filter((item) => item.maNganh != formValues.maNganh))
            setLoading(false);
          }).catch((err) => {
            showMessage('error', 'Xóa ngành thất bại');
            setLoading(false);
          })


        break;
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
        setDataModal({ open: true, typeSubmit: 'EDIT-NGANH', prevData: record, title: 'Sửa ngành', schema: columns.slice(1, 2) });
        // console.log(record, type);
        break;
      case 'DELETE-ROW':
        handleSubmit(record, 'DELETE-NGANH')
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
      title: 'Mã Ngành',
      dataIndex: 'maNganh',
      key: 'maNganh',
    },
    {
      title: 'Tên Ngành',
      dataIndex: 'tenNganh',
      key: 'tenNganh',
    },
    {
      title: 'action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) =>
        <Space>
          <Button type="primary" ghost size='small' onClick={() => { handleClick(record, 'EDIT-ROW') }}
            icon={<EditOutlined />}>Sửa Tên</Button>
          <Button disabled={record.count_trung_tuyen > 0} danger type="default" size='small' onClick={() => { handleClick(record, 'DELETE-ROW') }}
            icon={<DeleteOutlined />}
          >Xoá</Button>
        </Space>
    }
  ]
  const fetchData = () => {

    setLoading(true);
    TuyenSinhAPI.getNganh(filter).then((res) => {
      setDataNganh(res.data);
      setLoading(false);
    }).finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    setLoading(true);
    TuyenSinhAPI.getDanhSachNganh(filter).then((res) => {
      setDataNganh(res.data);
      setLoading(false);
    }).catch((err) => {
      console.log(err);
      setLoading(false);
    })

  }, [filter]);
  return (

    <div style={{ overflowX: 'scroll' }}>
      <Spin spinning={loading} >
        <Row style={{ justifyContent: 'right', marginBottom: '10px' }}>
          <Space>
            <Button onClick={() => showDialogModal('CREATE-NGANH', columns.slice(0,2), "Thêm Ngành")} > Thêm Ngành</Button>
            <SearchBar onSearching={e => { setFilter({ ...filter, search: e }) }} label="Tìm Kiếm Ngành" />
          </Space>
        </Row>
        {dataNganh && loading == false &&
          <Row>
            <Col span={24}>
              <AntTable columns={columns} rows={dataNganh} loading={loading} />
            </Col>
          </Row>}
        <Modal title={dataModal.title} open={dataModal.open} footer={false} style={{ padding: '5px' }} onCancel={handleCancel}>
          <FormTaoKhoa onOk={handleOk} prevValues={dataModal.prevData} onCancel={handleCancel} onSubmit={(form) => handleSubmit(form, dataModal.typeSubmit)} schema={dataModal.schema || []} />
        </Modal>
      </Spin>
    </div>
  )
}