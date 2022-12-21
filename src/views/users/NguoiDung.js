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
  const [filter, setFilter] = useState({ search: '', page: 1, limit: 10 });
  const [dataModal, setDataModal] = useState({ open: false, typeSubmit: null, prevData: {}, title: '', schema: null });
  const showDialogModal = (typeSubmit, schema, title, prevData) => {
    setDataModal({ ...dataModal, open: true, typeSubmit: typeSubmit, title: title, schema: schema, prevData: prevData });
  };
  const handleSubmit = (formValues, type) => {
    setLoading(true);
    console.log('formValues :>> ', formValues);
    switch (type) {
      case 'CREATE-ACCOUNT':
        let payload = {
          user: {
            username: formValues['email'],
            password: 'PTIT@123',
            role_id: 1
          },
          profile: {
            firstname: formValues.firstname,
            lastname: formValues.lastname,
            phone: formValues.phone,
          }
        }
        AuthAPI.createAccount(payload)
          .then((res) => {
            showMessage('success', 'Tạo Account thành công');
            // setDataModal({ ...dataModal, open: false });
            // setDataAccount(dataAccount.push(res.data));
            fetchData();
          }).catch((err) => {
            setLoading(false);            
            showMessage('error', 'Tạo Account thất bại');
          });
        break;
      case 'EDIT-PROFILE':
        setDataModal({ ...dataModal, open: false });
        let { user_id, payloadUpdate } = formValues;
        AuthAPI.updateProfile(user_id, formValues)
          .then((res) => {
            showMessage('success', 'Cập nhật Account thành công');
            fetchData();
            setDataAccount(dataAccount.map((item) => {
              if (item.user_id == user_id) {
                return { ...item, profile: payloadUpdate }
              }
              return item;
            }))
          }).catch((err) => {
            setLoading(false);
            showMessage('error', 'Cập nhật Account thất bại');
          })

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
        setDataModal({
          open: true, typeSubmit: 'EDIT-PROFILE', prevData: record.profile, title: 'Sửa Account', schema: formschema.slice(1).concat({
            title: 'trạng thái',
            dataIndex: 'active',
            type: 'select',
            options: [
              { value: 'active', label: 'active' },
              { value: 'inactive', label: 'inactive' },
            ]
          })
        });
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
  const formschema = [
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Tên',
      dataIndex: 'firstname',
    },
    {
      title: 'Họ',
      dataIndex: 'lastname',
    },{
      title: 'Số Điện thoại',
      dataIndex: 'phone',
    },


  ]

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
    },{
      title: 'Phân Quyền',
      dataIndex: 'role',
      key: 'role',
      render: role => {
        return role.name
      },
      width: 100
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
    setLoading(true);
    AuthAPI.getDanhSachAccount(filter).then((res) => {
      setDataAccount(res.data);
      setLoading(false);
    }).catch((err) => {
      console.log(err);
      setLoading(false);
    })
  }

  useEffect(() => {
    fetchData();

  }, [filter]);
  return (

    <div style={{ overflowX: 'scroll' }}>
      <Spin spinning={loading} >
        <Row style={{ justifyContent: 'right', marginBottom: '10px' }}>
          <Space>
            <Button onClick={() => showDialogModal('CREATE-ACCOUNT', formschema, "Thêm Account")} > Thêm Account</Button>
            <SearchBar onSearching={e=>{setFilter({...filter, search:e})}} label="Tìm Kiếm Account" />
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