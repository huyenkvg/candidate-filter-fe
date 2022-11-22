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


export default function ToHopXetTuyen() {

  const [loading, setLoading] = useState(true);
  const [dataToHopXetTuyen, setDataToHopXetTuyen] = useState(null);
  const [dataModal, setDataModal] = useState({ open: false, typeSubmit: null, prevData: {}, title: '', schema: null });
  const showDialogModal = (typeSubmit, schema, title, prevData) => {
    setDataModal({ ...dataModal, open: true, typeSubmit: typeSubmit, title: title, schema: schema, prevData: prevData });
  };
  const handleSubmit = (formValues, type) => {
    setLoading(true);
    console.log('formValues :>> ', formValues);
    switch (type) {
      case 'CREATE-TO-HOP':
        TuyenSinhAPI.createToHopXetTuyen(formValues)
          .then((res) => {
            showMessage('success', 'Tạo tổ hợp thành công');
            setLoading(false);
            setDataModal({ ...dataModal, open: false });
            setDataToHopXetTuyen(dataToHopXetTuyen.concat(res.data));
          }).catch((err) => {
            setLoading(false);
            showMessage('error', 'Tạo tổ hợp thất bại, Mã tổ hợp đã tồn tại');
          });
        break;
      case 'EDIT-TO-HOP':
        let { maToHop, mon1, mon2, mon3 } = formValues;
        TuyenSinhAPI.updateToHopXetTuyen({ maToHop, mon1, mon2, mon3 })
          .then((res) => {
            showMessage('success', 'Cập nhật tổ hợp thành công');
            setDataToHopXetTuyen(dataToHopXetTuyen.map((item) => {
              if (item.maToHop == maToHop) {
                return { maToHop, mon1, mon2, mon3 }
              }
              return item;
            }))
            setLoading(false);
            setDataModal({ ...dataModal, open: false });
          })

        break;
      case 'DELETE-TO-HOP':
        TuyenSinhAPI.deleteToHopXetTuyen({ maToHop: formValues.maToHop })
          .then((res) => {
            showMessage('success', 'Xóa tổ hợp thành công');
            setDataToHopXetTuyen(dataToHopXetTuyen.filter((item) => item.maToHop != formValues.maToHop))
            setLoading(false);
          }).catch((err) => {
            showMessage('error', 'Xóa tổ hợp thất bại');
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
        setDataModal({ open: true, typeSubmit: 'EDIT-TO-HOP', prevData: record, title: 'Sửa tổ hợp', schema: columns.slice(1, 2) });
        // console.log(record, type);
        break;
      case 'DELETE-ROW':
        handleSubmit(record, 'DELETE-TO-HOP')
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
      title: 'Mã Tổ Hợp',
      dataIndex: 'maToHop',
      key: 'maToHop',
    },
    {
      title: 'Môn 1',
      dataIndex: 'mon1',
      key: 'mon1',
    },
    {
      title: 'Môn 2',
      dataIndex: 'mon2',
      key: 'mon2',
    },
    {
      title: 'Môn 3',
      dataIndex: 'mon3',
      key: 'mon3',
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
    TuyenSinhAPI.getDanhSachToHopXetTuyen().then((res) => {
      setDataToHopXetTuyen(res.data);
    }).finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    TuyenSinhAPI.getDanhSachToHopXetTuyen().then((res) => {
      setDataToHopXetTuyen(res.data);
      setLoading(false);
    }).catch((err) => {
      console.log(err);
      setLoading(false);
    })

  }, []);
  return (

    <div style={{ overflowX: 'scroll' }}>
      <Spin spinning={loading} >
        <Row style={{ justifyContent: 'right', marginBottom: '10px' }}>
          <Space>
            <Button onClick={() => showDialogModal('CREATE-TO-HOP', columns.slice(0,4), "Thêm Tổ Hợp")} > Thêm Tổ Hợp</Button>
            <SearchBar onSearching={e=>{}} label="Tìm Kiếm Tổ Hợp" />
          </Space>
        </Row>
        {dataToHopXetTuyen &&
          <Row>
            <Col span={24}>
              <AntTable columns={columns} rows={dataToHopXetTuyen} loading={loading} />
            </Col>
          </Row>}
        <Modal title={dataModal.title} open={dataModal.open} footer={false} style={{ padding: '5px' }} onCancel={handleCancel}>
          <FormTaoKhoa onOk={handleOk} prevValues={dataModal.prevData} onCancel={handleCancel} onSubmit={(form) => handleSubmit(form, dataModal.typeSubmit)} schema={dataModal.schema || []} />
        </Modal>
      </Spin>
    </div>
  )
}