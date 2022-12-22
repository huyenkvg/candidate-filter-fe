import { Button, Card, Col, Divider, Form, Input, message, Modal, Row, Space, Spin } from "antd"
import { useEffect, useState } from "react"
import TuyenSinhAPI from "../../../apis/TuyenSinhAPI";
import { MinusOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";

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
export default function DiemChuanDuKien({ maDotTuyenSinh, title, chi_tieu_tuyen_sinh, onRefilter, lock, ...props }) {
  const [loading, setLoading] = useState(false);
  const [ds_diem_chuan, setDs_diem_chuan] = useState(null);
  const [ds_diem_chuan_to_hop, setDs_diem_chuan_to_hop] = useState(null);
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
      if (typeof (cur['diemChuan']) == 'number') {
        ret[cur.maNganh] = {}
        chi_tieu_tuyen_sinh.forEach(item => {
          if (item.maNganh == cur.maNganh) {
            item.chi_tieu_to_hop?.forEach(tohop => {
              ret[cur.maNganh][tohop.maToHop] = cur['diemChuan'];
            })
          }
        })

      }
      else {
        try {
          ret[cur.maNganh] = {};
          const dc = JSON.parse(cur['diemChuan'])
          ret[cur.maNganh] = { ...dc, gioi_han_nguyen_vong: (dc.gioi_han_nguyen_vong || 'INF')}
        }
        catch (err) {
          console.log('err :>> ', err);
          ret[cur.maNganh] = Number.parseFloat(cur['diemChuan']);
        }

      }
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
  const onClickSaveNewDiemChuan = (maNganh, value) => {
    console.log('newDiemChuan :>> ', newDiemChuan);
    let valid = true;

      showMessage('info', `Những điểm chuẩn để trống sẽ được giữ nguyên điểm cũ`)
    chi_tieu_tuyen_sinh.forEach(item => {

      if (!newDiemChuan[item.maNganh]) {
        newDiemChuan[item.maNganh] = {};
      };


      item.chi_tieu_to_hop.map(tohop => {
        if (!newDiemChuan[item.maNganh]['gioi_han_nguyen_vong'] || newDiemChuan[item.maNganh]['gioi_han_nguyen_vong'] == '' || newDiemChuan[item.maNganh]['gioi_han_nguyen_vong'] < 0) {
          newDiemChuan[item.maNganh].gioi_han_nguyen_vong = 'INF';
        }
        if (!newDiemChuan[item.maNganh][tohop.maToHop] || newDiemChuan[item.maNganh][tohop.maToHop]) {
          if (newDiemChuan[item.maNganh] && !newDiemChuan[item.maNganh][tohop.maToHop]) {
            console.log('ds_diem_chuan[] :>> ', ds_diem_chuan[item.maNganh][tohop.maToHop]);
            newDiemChuan[item.maNganh][tohop.maToHop] = ds_diem_chuan[item.maNganh][tohop.maToHop];
            // valid = false;
            // showMessage('info', `Vui lòng nhập đủ điểm chuẩn tất cả các tổ hợp cho ngành ${item.maNganh} `)
            // return;
          }
          // valid = false;
          // return;
        }

      })


    })
    if (valid) {
      setModal({
        open: true,
        content: "Danh Sách Điểm Chuẩn Cũ Sẽ Bị Thay Thế. Danh Sách Trúng Tuyển cũng sẽ thay đổi. Bạn có chắc chắn muốn lưu danh sách điểm chuẩn mới?"
      })
    }

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
      <Button disabled={lock} icon={alowChange ? <MinusOutlined /> : <PlusOutlined />} onClick={() => setAlowChange(!alowChange)}>{alowChange ? 'Ẩn Thay đổi' : 'Mở thay đổi'}</Button>
      {alowChange && <Button type="primary" icon={<SaveOutlined />} onClick={onClickSaveNewDiemChuan}>Lưu Danh Sách Điểm Chuẩn Mới</Button>}
    </Space>}
  <Spin spinning={loading}>
    <Form
      name="basic"
      labelCol={{
        span: 14,
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
        // console.log('item :>> ', item);
        return (<>
          <Row key={index}>
            <Col span={10}>
              <p> {item.maNganh} - {item.nganh?.tenNganh}</p>
            
              {!ds_diem_chuan[item.maNganh] ? (is_tuyen_thang ? '--Không có điểm chuẩn--' : '--Chưa có--') :
                (Object.keys(ds_diem_chuan[item.maNganh]).map(x => (
                    <p>{x} : {ds_diem_chuan[item.maNganh][x]}</p>
                  ))
                )
              }
            </Col>
            <Col span={14}>
            {alowChange && ds_diem_chuan && <>
              {/* <Form.Item
              style={{ textAlign: 'right', color: '#185adb' }}
              label="Nhập điểm chuẩn: "
              name={item.maNganh}
              onChange={(e) => {
                setNewDiemChuan({
                  ...newDiemChuan,
                  [item.maNganh]: e.target.value
                })
              }}
            > <Input /> </Form.Item>  */}
              <Form.Item
                style={{ textAlign: 'right', color: '#185adb', margin: '0px' }}
                label={`Nhập giới hạn nguyện vọng`}
                name={'gioi_han_nguyen_vong' + item.maNganh}
                onChange={(e) => {
                  setNewDiemChuan(prev => ({
                    ...newDiemChuan,
                    [item.maNganh]: { ...prev[item.maNganh], ['gioi_han_nguyen_vong']: e.target.value }
                  }))
                }}

              > <Input type="number" /> </Form.Item>

              {item.chi_tieu_to_hop?.map((toHop) => (
                <Form.Item
                  style={{ textAlign: 'right', color: '#185adb', margin: '1px' }}
                  label={`Nhập điểm chuẩn Tổ hợp ${toHop.maToHop}`}
                  name={toHop.maToHop}
                  initialValue={ds_diem_chuan[item.maNganh]?.[toHop.maToHop]}
                  onChange={(e) => {
                    setNewDiemChuan(prev => ({
                      ...newDiemChuan,
                      [item.maNganh]: { ...prev[item.maNganh], [toHop.maToHop]: e.target.value }
                    }))
                  }}

                > <Input type="number" required /> </Form.Item>
              ))}
            </>}
            </Col>
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
    width={800}
    onCancel={() => setModal({
      open: false,
      content: null,
    })}
    onOk={onUpdateDiemChuan}
  >
    <p>{modal.content}</p>
    {chi_tieu_tuyen_sinh && newDiemChuan && <ul>
      {chi_tieu_tuyen_sinh.map((item, index) => {
        return <li key={index}>{item.maNganh}:
          {Object.keys(newDiemChuan[item.maNganh]).map(x => (
            x == 'gioi_han_nguyen_vong' ? '' : 
            `${x} : ${newDiemChuan[item.maNganh][x]}; `
          ))}
        </li>
      }
      )}
    </ul>
    }
  </Modal>
  }

</Card>
)
};