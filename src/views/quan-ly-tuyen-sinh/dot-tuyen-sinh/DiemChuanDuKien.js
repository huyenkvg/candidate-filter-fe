import { Button, Card, Col, Divider, Form, Input, Modal, Row, Space, Spin } from "antd"
import { useEffect, useState } from "react"
import TuyenSinhAPI from "../../../apis/TuyenSinhAPI";
import { MinusOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";


export default function DiemChuanDuKien({ maDotTuyenSinh, title, chi_tieu_tuyen_sinh, onRefilter, ...props }) {
  const [loading, setLoading] = useState(false);
  const [ds_diem_chuan, setDs_diem_chuan] = useState(null);
  const [is_tuyen_thang, setIs_tuyen_thang] = useState(true);
  const [newDiemChuan, setNewDiemChuan] = useState({});
  const [modal, setModal] = useState({
    open: false,
    content: null,
  });
  const [alowChange, setAlowChange] = useState(false);
  const onUpdateDiemChuan = () => {
    setModal({
      open: false
    })
    console.log('update :>> ', { ...ds_diem_chuan, ...newDiemChuan });
    TuyenSinhAPI.saveDiemChuan(maDotTuyenSinh, { ...ds_diem_chuan, ...newDiemChuan }).finally(() => {
      onRefilter()
    })
  

  // setLoading(true);
}
const fetchData = () => {
  setLoading(true);
  // setIs_tuyen_thang(true);
  TuyenSinhAPI.DIEMCHUAN_DUKIEN(maDotTuyenSinh).then(res => {

    setDs_diem_chuan(res.data.reduce((ret, cur) => {
      ret[cur.maNganh] = cur['diemChuan'];
      //có điểm có điểm :)))
      if (cur['diemChuan']) setIs_tuyen_thang(false);
      return ret;
    }, {}));
    console.log('chi_tieu_tuyen_sinh :>> ', chi_tieu_tuyen_sinh);
  }).catch(() => {
    setDs_diem_chuan(null)
  }).finally(() => {
    setLoading(false);
  })

}
useEffect(() => {
  fetchData()
}, [])
return (<Card
  title={title}
  bordered={false}
>
  {is_tuyen_thang ?
    <h4 style={{ color: '#185adb' }}>Đây là đợt tuyển thẳng nên các ngành đều không có điểm chuẩn</h4>
    : <Space>
      <Button icon={alowChange ? <MinusOutlined /> : <PlusOutlined />} onClick={() => setAlowChange(!alowChange)}>{alowChange ? 'Ẩn Thay đổi' : 'Mở thay đổi'}</Button>
      {alowChange && <Button type="primary" icon={<SaveOutlined />} onClick={() => setModal({
        open: true,
        content: "Danh Sách Điểm Chuẩn Cũ Sẽ Bị Thay Thế. Danh Sách Trúng Tuyển cũng sẽ thay đổi. Bạn có chắc chắn muốn lưu danh sách điểm chuẩn mới?"
      })}>Lưu Danh Sách Điểm Chuẩn Mới</Button>}
    </Space>}
  <Spin spinning={loading}>
    <Form
      name="basic"

      labelCol={{
        span: 10,
      }}
      wrapperCol={{
        span: 10,
      }}
      initialValues={{
      }}
      // onFinish={onFinish}
      // onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {(chi_tieu_tuyen_sinh && ds_diem_chuan) && chi_tieu_tuyen_sinh.map((item, index) => {
        return (<>
          <Row key={index}>
            <Col span={18}>
              <p> {item.maNganh} - {item.nganh?.tenNganh}</p>
            </Col>
            <Col span={6} style={{ textAlign: 'left', color: 'red' }}>
              {ds_diem_chuan[item.maNganh] || (is_tuyen_thang ? '--Không có--' : '--Chưa có--')}
            </Col>
            {alowChange && <Form.Item
              style={{ textAlign: 'right', color: '#185adb' }}
              label="Nhập điểm chuẩn: "
              name={item.maNganh}
              onChange={(e) => {
                setNewDiemChuan({
                  ...newDiemChuan,
                  [item.maNganh]: e.target.value
                })
              }}
            >
              <Input />
            </Form.Item>}
            {/* <Input value={ds_diem_chuan[item.maNganh]} style={{ width: '100px' }} /> */}
          </Row>
          <Divider style={{ marginBottom: '1px' }} />
        </>
        )
      })}

    </Form>
  </Spin>
  {modal.open && <Modal
    title="Xác nhận lưu danh sách điểm chuẩn mới"
    open={modal.open}
    onCancel={() => setModal({
      open: false,
      content: null,
    })}
    onOk={onUpdateDiemChuan}
  >
    <p>{modal.content}</p>
    {chi_tieu_tuyen_sinh && newDiemChuan && <ul>
      {chi_tieu_tuyen_sinh.map((item, index) => {
        return <li key={index}>{item.maNganh}-{item.tenNganh}: {{ ...ds_diem_chuan, ...newDiemChuan }[item.maNganh]} </li>
      }
      )}
    </ul>
    }
  </Modal>
  }

</Card>
)
};