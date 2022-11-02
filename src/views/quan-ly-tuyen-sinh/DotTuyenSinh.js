import { Alert, Button, Col, Divider, Input, List, message, Row, Spin, Tree } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CandidateAPI from "../../apis/CandidateAPI";
import TuyenSinhAPI from "../../apis/TuyenSinhAPI";
import UploadButton from "../../components/input/UpLoadButton";
import AntTable from "../../components/table/AntTable";
import { setDanhSachKhoaTuyenSinh } from "../../features/QuanLyTuyenSinh/tuyenSinhSlice";
import { setDanhSachCandidate } from "../../features/ThiSinh/candidateSlice";


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

export default function DotTuyenSinh() {
  // Khai báo
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const tuyenSinhState = useSelector((state) => state.tuyenSinh);

  const khoa_columns = [
    {
      title: 'Đợt Tuyển Sinh',
      dataIndex: 'maDotTuyenSinh',
      key: 'maDotTuyenSinh',
    },
    {
      title: 'Khoá Tuyển Sinh',
      dataIndex: 'maKhoa',
      key: 'maKhoa',
    },
    {
      title: 'Số lượng trúng tuyển',
      dataIndex: 'count_trung_tuyen',
      key: 'scount_trung_tuyen',
    },
    // {
    //   title: 'Thao tác',
    //   dataIndex: 'action',
    //   key: 'action',
    //   render: (text, record) => (
    //     <span>
    //     </span>
    //   ),
    // },
  ]

  // Effect
  // useEffect(() => {
  //   // Lấy danh sách tất cả các khoá
  //   TuyenSinhAPI.getDanhSachKhoaTuyenSinh().then(
  //     (res) => {
  //       dispatch(setDanhSachKhoaTuyenSinh(res.data));
  //       showMessage('success', 'Lấy danh sách khoá tuyển sinh thành công');
  //     }
  //   ).catch(err =>{
  //     showMessage("error", "Lỗi khi lấy danh sách khoá tuyển sinh");
  //   }).finally(() => {
  //     setLoading(false);
  //   });
  // }, []);


  return (
    <div style={{ overflowX: 'scroll' }}>
      <Spin spinning={loading} >
        <Row style={{ overflowY: 'scroll', maxHeight: '60vh' }}>
          <Col span={10}>
          </Col>
          <Col span={14}>
          </Col>
        </Row>
        <Divider />
        <Row style={{ textAlign: 'right', marginBottom: '10px' }}>
          <Button>Thêm Đợt Tuyển Sinh</Button>
        </Row>
        <Row>
          <Col span={24}>
            <AntTable columns={khoa_columns} rows={tuyenSinhState.list_dot_ts} loading={loading} />
          </Col>
        </Row>
      </Spin>
    </div>
  );
}