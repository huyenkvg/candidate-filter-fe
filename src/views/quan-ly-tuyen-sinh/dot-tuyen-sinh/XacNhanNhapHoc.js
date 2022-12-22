import { message, Modal, Row, Space } from "antd";
import { useState } from "react";
import TuyenSinhAPI from "../../../apis/TuyenSinhAPI";
import UploadButton from "../../../components/input/UpLoadButton";
import AntTable from "../../../components/table/AntTable";
import ModalDSXT from "../local-components/ModalDSXT";
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

export default function XacNhanNhapHoc({ maDotTuyenSinh , lock}) {

  const [fileInput, setFileInput] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validRows, setvalidRows] = useState([]);
  const [model, setModel] = useState({
    open: false,

  });
  const xacNhanNhapHoc = () => {
    if (fileInput && validRows?.length > 0) {
      setModel({ open: false });
      setLoading(true);
      TuyenSinhAPI.XACNHAN_NHAPHOC(maDotTuyenSinh, fileInput).then(res => {
        if (res.data.error) {
          showMessage('error', res.data.error);
        }
        else {
          showMessage('success', 'Xác nhận nhập học thành công!');
        }

      }).catch(err => {
        showMessage('error', 'Upload file thất bại, vui lòng kiểm tra lại file');
        // showMessage('error', err.response.data.error);
      }).finally(() => {
        setFileInput(null);
        setLoading(false);
      })
    }
    else{
      showMessage('error', 'Có lỗi xảy ra, Vui lòng thao tác lại');
    }
  }
  const upFileHandler = (data) => {
    console.log('data upload :>> ', data);
    setLoading(true);
    TuyenSinhAPI.upload_XACNHAN_NHAPHOC(maDotTuyenSinh, data).then(res => {
      console.log('res. :>> ', res.data);
      setvalidRows(res.data?.validRows);
      setModel({ open: true });
      if (res.data.error) {
        showMessage('error', res.data.error);
      }
      setFileInput(data);
      setLoading(false);
    }).catch(err => {
      setFileInput(null);
      showMessage('error', 'Upload file thất bại');
      // showMessage('error', err.response.data.error);
    }).finally(() => {
      setLoading(false);
    })

  }
  return (

    <Space style={{ alignContent: 'center' }}>
      <h3>Upload danh sách xác nhận nhập học</h3>
      <UploadButton onUpload={upFileHandler} disabled={lock} />
      {model.open && <Modal
        key='w'
        centered
        title={`BẠN CÓ CHẮC CHẮN MUỐN XÁC NHẬN NHẬP HỌC CHO ${validRows?.length} THÍ SINH NÀY?`}
        open={model.open}
        width={900}
        bodyStyle={{ height: 650 }}
        onCancel={() => setModel({ open: false })}
        onOk={xacNhanNhapHoc}
      >
        {validRows?.length > 0 && !loading && <AntTable loading={loading} columns={[
          { dataIndex: 'soBaoDanh', title: 'Số Báo Danh', key: 'soBaoDanh', width: 100 },
          { dataIndex: 'hoTen', title: 'Họ và Tên', key: 'hoVaTen', width: 200 },
        ]
        } rows={validRows} />}
      </Modal>}
    </Space>
  )

}