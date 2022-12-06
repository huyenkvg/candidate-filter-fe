import { Alert, Button, Col, Divider, Input, List, message, Modal, Row, Space, Spin, Tree } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { DownloadOutlined, EyeOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import SearchBar from "../quan-ly-tuyen-sinh/local-components/SearchBar";
import AntTable from "../../components/table/AntTable";
import { FormTaoKhoa } from "../quan-ly-tuyen-sinh/local-components/FormTaoKhoa";
import AuthAPI from "../../apis/AuthAPI";

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


export default function NguoiDung() {

  const [loading, setLoading] = useState(true);
  const [dataAccount, setDataAccount] = useState(null);
  const [dataModal, setDataModal] = useState({ open: false, typeSubmit: null, prevData: {}, title: '', schema: null });
  const showDialogModal = (typeSubmit, schema, title, prevData) => {
    setDataModal({ ...dataModal, open: true, typeSubmit: typeSubmit, title: title, schema: schema, prevData: prevData });
  };
  const handleSubmit = (formValues, type) => {
    setLoading(true);
    console.log('formValues :>> ', formValues);
    switch (type) {
      case 'CREATE-ACCOUNT':
        AuthAPI.createAccount(formValues)
          .then((res) => {
            showMessage('success', 'Tạo Account thành công');
            setDataModal({ ...dataModal, open: false });
            setDataAccount(dataAccount.push(res.data));
            setLoading(false);
          }).catch((err) => {
            setLoading(false);
            showMessage('error', 'Tạo Account thất bại, Mã Account đã tồn tại');
          });
        break;
      case 'EDIT-ACCOUNT':
        let { maAccount, tenAccount } = formValues;
        // TuyenSinhAPI.updateAccount({ maAccount, tenAccount })
        //   .then((res) => {
        //     showMessage('success', 'Cập nhật Account thành công');
        //     setDataAccount(dataAccount.map((item) => {
        //       if (item.maAccount == maAccount) {
        //         return { ...item, tenAccount }
        //       }
        //       return item;
        //     }))
        //     setLoading(false);
        //     setDataModal({ ...dataModal, open: false });
        //   })

        break;
      case 'DELETE-ACCOUNT':
        // TuyenSinhAPI.deleteAccount({ maAccount: formValues.maAccount })
        //   .then((res) => {
        //     showMessage('success', 'Xóa Account thành công');
        //     setDataAccount(dataAccount.filter((item) => item.maAccount != formValues.maAccount))
        //     setLoading(false);
        //   }).catch((err) => {
        //     showMessage('error', 'Xóa Account thất bại');
        //     setLoading(false);
        //   })


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
        setDataModal({ open: true, typeSubmit: 'EDIT-ACCOUNT', prevData: record, title: 'Sửa Account', schema: columns.slice(1, 2) });
        // console.log(record, type);
        break;
      case 'DELETE-ROW':
        handleSubmit(record, 'DELETE-ACCOUNT')
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
      title: 'Họ Tên',
      dataIndex: 'profile',
      key: 'maAccount',
      render: profile => {
        return profile?.lastname + ' ' + profile?.firstname
      },
    },
    {
      title: 'Tài Khoản',
      dataIndex: 'username',
      key: 'tenAccount',
    },
    {
      title: 'Email',
      dataIndex: 'profile',
      key: 'email',
      width: 130,
      render: profile => {
        return profile?.email
      }

    },
    {
      title: 'Số Điện thoại',
      dataIndex: 'profile',
      key: 'phone',
      render: profile => {
        return profile?.phone
      }
    },
    {
      title: 'Trạng thái tài khoản',
      dataIndex: 'active',
      key: 'active',
      render: active => {
        return <p style={{color: active? 'green': 'orange'}}>{active ? 'Đang hoạt động' : 'Đã khóa'}</p>
      }
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
    // TuyenSinhAPI.getAccount().then((res) => {
    //   setDataAccount(res.data);
    // }).finally(() => {
    //   setLoading(false);
    // })
  }

  useEffect(() => {
    AuthAPI.getDanhSachAccount().then((res) => {
      setDataAccount(res.data);
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
            <Button onClick={() => showDialogModal('CREATE-ACCOUNT', columns.slice(0, 2), "Thêm Account")} > Thêm Account</Button>
            <SearchBar onSearching={e=>{}} label="Tìm Kiếm Account" />
          </Space>
        </Row>
        {dataAccount && !loading &&
          <Row>
            <Col span={24}>
              <AntTable columns={columns} rows={dataAccount} loading={loading} />
            </Col>
          </Row>}
        <Modal title={dataModal.title} open={dataModal.open} footer={false} style={{ padding: '5px' }} onCancel={handleCancel}>
          <FormTaoKhoa onOk={handleOk} prevValues={dataModal.prevData} onCancel={handleCancel} onSubmit={(form) => handleSubmit(form, dataModal.typeSubmit)} schema={dataModal.schema || []} />
        </Modal>
      </Spin>
    </div>
  )
}