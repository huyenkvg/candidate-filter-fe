
import { Alert, Button, Col, Divider, Input, List, message, Modal, Row, Space, Spin, Tabs, Tree } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CandidateAPI from "../../../apis/CandidateAPI";
import TuyenSinhAPI from "../../../apis/TuyenSinhAPI";
import UploadButton from "../../../components/input/UpLoadButton";
import AntTable from "../../../components/table/AntTable";
import { setDanhSachKhoaTuyenSinh } from "../../../features/QuanLyTuyenSinh/tuyenSinhSlice";
import { reset, setDanhSachCandidate, setDataXetTuyen } from "../../../features/ThiSinh/candidateSlice";
import { DownloadOutlined, EyeOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ChiTieuArrayFields from "../local-components/ChiTieuArrayFields";
import ModalDSXT from "../local-components/ModalDSXT";
import FileAPI from "../../../apis/FileAPI";


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
export default function UploadChiTieuTuyenSinh({ onOk, maDotTuyenSinh }) {

  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [data, setData] = useState({});
  const [modalControl, setModalControl] = useState({
    open: false,
    data: {
      columns: [],
      rows: []
    }

  });
  const upFileHandler = (data) => {
    console.log('data upload :>> ', data);
    setLoading(true);
    FileAPI.upload_DSChiTieu(data).then(res => {
      if (res.data.error) {
        showMessage('error', res.data.error);
      }
      // setFileInput(data);
      const { headerObject, rows } = res.data;
      let columns = Object.keys(headerObject).map((item) => {
        if (item == 'maToHopXetTuyen') {
          return {
            title: headerObject[item],
            dataIndex: item,
            key: item,
            render: (text, record) => {
              return (
                <Space>
                  {record.maToHopXetTuyen.map(
                    (item, index) => (
                      <span key={index}>{item}</span>
                    ))}
                </Space>
              )
            }
          }
        }
        return ({
          title: headerObject[item],
          dataIndex: item,
          key: item,
        })
      })

      let rowsData = rows.map((item, index) => ({ ...item, STT: index }));
      console.log('res.data :>> ', res.data);
      setFile(data);
      setData({ columns, rows: rowsData });
      setModalControl({ open: true, data: { columns, rows: rowsData } });
      setLoading(false);
    }).catch(err => {
      setFile(null);
      showMessage('error', 'Upload file thất bại');
    }).finally(() => {
      setLoading(false);
    })

  }
  const save = () => {
    setLoading(true);
    if (file) {
      FileAPI.upload_DSChiTieu(file, true, maDotTuyenSinh).then(res => {
        if (res.data.error) {
          showMessage('error', res.data.error);
        }
        onOk()
        setModalControl({ open: false, data: { columns: [], rows: [] } });
        // setFileInput(data);
      }).catch(err => {
        setFile(null);
        showMessage('error', 'Upload file thất bại');
      }).finally(() => {
        setLoading(false);
      })
    }
    else {
      showMessage('error', 'Vui lòng chọn lại file upload');
    }
  }

  return (
    <Space style={{ padding: 5 }}>
      <UploadButton onUpload={upFileHandler} />
      <Modal

        width={800}
        bodyStyle={{ height: 560 }}
        title="Danh sách chi tiêu" footer={null} onOk={() => { }}
        onCancel={() => {
          setModalControl({ ...modalControl, open: false })
          setFile(null);
        }} open={modalControl.open}>

        <Spin spinning={loading}>
          <AntTable
            scroll={{ x: 'max-content', y: 300 }}
            columns={modalControl.data.columns}
            rows={modalControl.data.rows}
            rowKey="STT"
            pagination={false} />
          <Button onClick={save} type="primary">Lưu </Button>
        </Spin>
      </Modal>
    </Space>
  )
}