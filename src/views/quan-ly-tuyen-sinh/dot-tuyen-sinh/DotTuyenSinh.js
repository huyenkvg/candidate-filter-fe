import { Alert, Button, Col, Divider, Input, List, message, Row, Space, Spin, Tabs, Tree } from "antd";
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
import UploadChiTieuTuyenSinh from "./UploadChiTieuTuyenSinh";

import { Excel } from "antd-table-saveas-excel";
import XacNhanNhapHoc from "./XacNhanNhapHoc";
import DiemChuanDuKien from "./DiemChuanDuKien";
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
function flattenObj(obj, parent, res = {}) {
  for (let key in obj) {
    let propName = parent ? parent + '.' + key : key;
    if (typeof obj[key] == 'object') {
      flattenObj(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
}
const ds_xettuyen_columns = [
  {
    title: 'stt',
    dataIndex: 'stt',
    key: 'stt',

  },
  {
    title: 'Số báo danh',
    dataIndex: 'soBaoDanh',
    key: 'soBaoDanh',

    width: 200,
  },
  {
    title: 'Nguyện Vọng',
    dataIndex: 'nguyenVong',
    key: 'nguyenVong',
    width: 10,
  },
  {
    title: 'Mã Ngành',
    dataIndex: 'maNganh',
    key: 'maNganh',
    width: 100,
  },

  {
    title: 'Họ Tên',
    dataIndex: 'hoTen',
    key: 'hoTen',
  },
  {
    title: 'Mã Tổ Hợp Xét Tuyển',
    dataIndex: 'maToHopXetTuyen',
    key: 'maToHopXetTuyen',
    width: 200,

  },
  {
    title: 'Tổng Điểm',
    dataIndex: 'tongDiem',
    key: 'tongDiem',

    width: 100,
  },
  {
    title: 'cmnd',
    dataIndex: 'cmnd',
    key: 'cmnd',
    width: 100,
  },
  {
    title: 'Địa Chỉ Nhận Giấy Báo',
    dataIndex: 'diaChiNhanGiayBao',
    key: 'diaChiNhanGiayBao',
    width: 200,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    
    width: 150,
  },
  {
    title: 'Giới Tính',
    dataIndex: 'gioiTinh',
    key: 'goiTinh',
    width: 100,
  },
  {
    title: 'Mã Tỉnh',
    dataIndex: 'maTinh',
    key: 'maTinh',
    width: 150,
  },
  {
    title: 'Mã Trường',
    dataIndex: 'maTruong',
    key: 'maTinh',
    width: 150,
  },
  {
    title: 'Khu Vực Ưu Tiên',
    dataIndex: 'khuVucUuTien',
    key: 'khuVucUuTien',
    width: 200,
  },
]
const ds_tt_columns = [
  {
    title: 'Số Báo Danh',
    dataIndex: 'soBaoDanh',
    key: 'soBaoDanh',
    width: 100,

  },  
  {
    title: 'Mã Ngành',
    dataIndex: 'maNganh',
    key: 'maNganh',
    width: 200,
  },
  {
    title: 'Mã Tổ Hợp Xét Tuyển',
    dataIndex: 'maToHopXetTuyen',
    key: 'maToHopXetTuyen',
    width: 200,
  },
  {
    title: 'Nguyện Vọng Trúng Tuyển',
    dataIndex: 'nguyenVongTrungTuyen',
    key: 'nguyenVong',
  },
  {
    title: 'Họ Tên',
    dataIndex: 'hoTen',
    key: 'hoTen',
  },
  {
    title: 'cmnd',
    dataIndex: 'cmnd',
    key: 'cmnd',
  },
  {
    title: 'Địa Chỉ Nhận Giấy Báo',
    dataIndex: 'diaChiNhanGiayBao',
    key: 'diaChiNhanGiayBao',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Giới Tính',
    dataIndex: 'gioiTinh',
    key: 'goiTinh',
  },
  {
    title: 'Mã Tỉnh',
    dataIndex: 'maTinh',
    key: 'maTinh',
  },
  {
    title: 'Mã Trường',
    dataIndex: 'maTruong',
    key: 'maTinh',
  },
  {
    title: 'Khu Vực Ưu Tiên',
    dataIndex: 'khuVucUuTien',
    key: 'khuVucUuTien',
  }
]
function RenderChiTieu({ chi_tieu_tuyen_sinh }) {
  const [freeNganh, setFreeNganh] = useState({});
  useEffect(() => { // chỉ cần 1 ngành null là free
    setFreeNganh({})
    console.log('chi_tieu_tuyen_sinh :>> ', chi_tieu_tuyen_sinh);
    chi_tieu_tuyen_sinh.map((it) => {
      it.chi_tieu_to_hop.map((item) => {
        if (!item.chiTieu) {

          setFreeNganh(freeNganh => ({ ...freeNganh, [it.maNganh]: true }))
        }

      })
    })
  }, [chi_tieu_tuyen_sinh])
  return (

    <>

      <p>Chỉ Tiêu:</p>
      {chi_tieu_tuyen_sinh.map((item, index) => (<>
        <p style={{ color: '#185adb', fontSize:'14px', fontWeight:'bold', }} key={index}>{item.maNganh} - {item.nganh.tenNganh}  : {item.chiTieu} (Thí sinh)</p>
        {
          freeNganh[item.maNganh] == true ? <>
            <Space>
              {item.chi_tieu_to_hop.map((x) => (<span key={x.maToHop}>{x.maToHop}- </span>))}
            </Space>
            Tỉ lệ tự do
          </>
            : <Space>
              {item.chi_tieu_to_hop.map((x) => (<p key={x.maToHop}>{x.maToHop} : {x.chiTieu} (Thí sinh)</p>))}
            </Space>
        }
        <Divider style={{ margin: '2px' }} />
      </>
      ))}
    </>
  )
}

export default function DotTuyenSinh() {
  // Khai báo
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [loading_dsxt, setLoading_dsxt] = useState(true);
  const [dataDotTuyenSinh, setDataDotTuyenSinh] = useState(null);
  const [lock, setLock] = useState(true);
  const [danh_sach_trung_tuyen, setDanh_sach_trung_tuyen] = useState([]);
  const [danh_sach_nguyen_vong, setDanh_sach_nguyen_vong] = useState([]);
  const [fileInput, setFileInput] = useState(null);
  const [modalResultControl, setModalResultControl] = useState({ open: false, title: "DANH SÁCH NGUYỆN VỌNG XÉT TUYỂN HỢP LỆ", loading: false, data: null });
  const maDotTuyenSinh = useParams().maDotTuyenSinh;
  const dispatch = useDispatch();

  // handleSubmitChiTieu
  const handleSubmitChiTieu = async (formValues) => {
    setLoading(true);
    console.log('values chi tieu :>> ', formValues);
    const chiTieuNganh = formValues.chiTieuNganh.map((item) => {
      return {
        maNganh: item.maNganh,
        maDotTuyenSinh: dataDotTuyenSinh.maDotTuyenSinh,
        chiTieu: Number.parseInt(item.chiTieu),
      }
    })
    let chiTieuToHop = formValues.chiTieuNganh.map((item) => {
      return (item.maToHop.map(x => ({
        maDotTuyenSinh: dataDotTuyenSinh.maDotTuyenSinh,
        maToHop: x,
        maNganh: item.maNganh,
        chiTieu: formValues.chiTieuToHop[item.maNganh] ? Number.parseInt(formValues.chiTieuToHop[item.maNganh][x]) : null
      })))
    }).flat()
    TuyenSinhAPI.updateChiTieuTuyenSinh(dataDotTuyenSinh.maDotTuyenSinh, { chiTieuNganh, chiTieuToHop }).then(res => {
      showMessage('success', 'Cập nhật chỉ tiêu thành công');
      fetch()
      // console.log('res :>> ', res);
    }).catch(err => {
      console.log('err :>> ', err);
      showMessage('error', 'Cập nhật chi tiêu thất bại');
    }).finally(() => {
      setLoading(false);
    })
  }
  // Effect
  useEffect(() => {
    dispatch(reset())
    if (maDotTuyenSinh) {
      setLoading(true);
      TuyenSinhAPI.getDSXTDotTuyenSinh(maDotTuyenSinh).then(res => {
        console.log('res.data :>> ', res.data.length);
        setDanh_sach_nguyen_vong(res.data);
      }).finally(() => {
        showMessage('success', 'Lấy thông tin đợt tuyển sinh thành công');
        setLoading_dsxt(false);
      })
      TuyenSinhAPI.getDSTTDotTuyenSinh(maDotTuyenSinh).then(res => {

        console.log('res.data :>> ', res.data);
        setDanh_sach_trung_tuyen(res.data);
      })
      TuyenSinhAPI.getThongTinDotTuyenSinh(maDotTuyenSinh).then(
        (res) => {
          if (res.data.lock != true)
            setLock(false);
          console.log('res.data :>> ', res.data.danh_sach_trung_tuyen);
          setDataDotTuyenSinh({
            ...dataDotTuyenSinh,
            ...res.data,
            // danh_sach_trung_tuyen: res.data.danh_sach_trung_tuyen.map(item => flattenObj(item)),
            // danh_sach_nguyen_vong: res.data.danh_sach_nguyen_vong.map(item => flattenObj(item)),
          });
          ;

        }
      ).catch(err => {
        showMessage("error", "Lỗi khi lấy thông tin đợt tuyển sinh tuyển sinh");
      }).finally(() => {
        setLoading(false);
      })
    }
  }, [maDotTuyenSinh, reload]);
  // fetch data
  const fetch = async () => {
    setReload(!reload);
  }
  // Render
  const onSaveTuyenThang = () => {
    if (fileInput) {
      setModalResultControl({ ...modalResultControl, open: false });
      setLoading(true);
      TuyenSinhAPI.saveTuyenThang(maDotTuyenSinh, fileInput).then(res => {
        showMessage('success', 'Lưu danh sách tuyển thẳng thành công');
        fetch();
      }).catch(err => {
        showMessage('error', 'Lưu danh sách  tuyển thẳng thất bại');
      }).finally(() => {
        setLoading(false);
      })
    }
    else {
      showMessage('error', 'Đã có lỗi xảy ra, vui lòng thao tác lại');
    }
  }
  const onSaveDSXT = () => {
    if (fileInput) {
      setModalResultControl({ ...modalResultControl, open: false });
      setLoading(true);
      TuyenSinhAPI.saveDSXT_DotTuyenSinh(maDotTuyenSinh, fileInput).then(res => {
        showMessage('success', 'Lưu danh sách xét tuyển thành công');
        fetch();
      }).catch(err => {
        showMessage('error', 'Lưu danh sách xét tuyển thất bại');
      }).finally(() => {
        setLoading(false);
      })
    }
    else {
      showMessage('error', 'Đã có lỗi xảy ra, vui lòng thao tác lại');
    }

  }
  const upFileHandler = (data) => {
    console.log('data upload :>> ', data);
    setLoading(true);
    TuyenSinhAPI.upload_DSNguyenVong_DotTuyenSinh(maDotTuyenSinh, data).then(res => {
      if (res.data.error) {
        showMessage('error', res.data.error);
      }
      setFileInput(data);
      const { headerObject, wishList } = res.data;
      let rows = wishList.map((x, index) => ({ ...x, key: index }));
      let columns = Object.keys(headerObject).map((item) => ({
        title: headerObject[item],
        dataIndex: item,
        key: item,
      }))

      dispatch(setDanhSachCandidate({ rows, columns, headerObject }));
      dispatch(setDataXetTuyen(res.data.checkList));
      setModalResultControl({ ...modalResultControl, open: true, loading: false });
      setLoading(false);
    }).catch(err => {
      setFileInput(null);
      console.log('err :>> ', err);
      showMessage('error', 'Upload file thất bại');
      // showMessage('error', err.response.data.error);
    }).finally(() => {
      setLoading(false);
    })

  }
  const onClickDownDSTT = (columns, dataSource, file_name) => {
    const excel = new Excel();
    excel
      .addSheet("Mini")
      .addColumns(columns)
      .addDataSource(dataSource, {
        str2Percent: true
      })
      .saveAs(`DotTuyenSinh-${dataDotTuyenSinh.tenDotTuyenSinh}-${file_name}.xlsx`);
  };
  const onOkUploadChiTieu = () => {
    showMessage('success', 'Upload chỉ tiêu thành công');
    fetch();
  }


  return (
    <div style={{ overflowX: 'scroll' }}>
      <Spin spinning={loading} >

        <Row>
          {!loading && dataDotTuyenSinh && <Col span={24}>
            <Row>
              <Col span={8}>
                <h3>Thông tin đợt tuyển sinh {dataDotTuyenSinh.tenDotTuyenSinh}</h3>
                {/* <p>Tổng nguyện vọng: {dataDotTuyenSinh._count.danh_sach_trung_tuyen}</p>
                <p>Tổng trúng tuyển: {dataDotTuyenSinh._count.danh_sach_nguyen_vong}></p> */}
                <p>Tổng ngành tuyển: {dataDotTuyenSinh._count.chi_tieu_tuyen_sinh}</p>
                {dataDotTuyenSinh._count.chi_tieu_tuyen_sinh > 0
                  && <RenderChiTieu chi_tieu_tuyen_sinh={dataDotTuyenSinh.chi_tieu_tuyen_sinh} />
                } 
                <UploadChiTieuTuyenSinh onOk={onOkUploadChiTieu} maDotTuyenSinh={maDotTuyenSinh}  lock = {lock}/>
                
                <Row>
                  <ChiTieuArrayFields submitChiTieu={handleSubmitChiTieu} existNganh={dataDotTuyenSinh.chi_tieu_tuyen_sinh.map(x => (x.maNganh))} />
                </Row>
              </Col>
              {danh_sach_trung_tuyen?.length > 0 &&
                <Col span={16}>
                  <DiemChuanDuKien lock={lock} maDotTuyenSinh={maDotTuyenSinh} onRefilter={() => setReload(!reload)} title={`Điểm chuẩn dự kiến đợt tuyển sinh ${dataDotTuyenSinh.tenDotTuyenSinh}`} chi_tieu_tuyen_sinh={dataDotTuyenSinh.chi_tieu_tuyen_sinh} />
                </Col>
              }
            </Row>
            <Divider />
            <Row>
              <Tabs
                defaultActiveKey="1"
                // onChange={onChange}
                items={[{
                  label: `DANH SÁCH XÉT TUYỂN`,
                  key: '1',
                  children: <Spin spinning={loading_dsxt}> <Row>
                    <Col span={24}><p>File Excel cần có Sheet tên "Mini" chứa dữ liệu cần trích xuất. Các Header của cột phải nằm ở hàng trên cùng. Các cột <span style={{ color: 'red' }}>Số Báo Danh, Mã Ngành, Tổng Điểm, Nguyện Vọng, Mã Tổ Hợp Xét Tuyển</span> là bắt buộc</p>
                    <p>Có Thể <Button onClick={()=> FileAPI.getExcelFileOf('nguyen-vong-mau')} type='link' icon={< DownloadOutlined />}>Tải Template</Button>để điền thông tin sau đó nộp</p>
                    </Col>

                    <Space style={{ padding: 5 }}>
                      <UploadButton onUpload={upFileHandler}  disabled={lock}/>
                      <Button type='primary' icon={< DownloadOutlined />} onClick={() => onClickDownDSTT(ds_xettuyen_columns, danh_sach_nguyen_vong.map((x, ind) => ({ ...x, stt: ind, key: ind })), 'DSNguyenVong')} >Tải về File DSXT</Button>
                    </Space>
                    <Col span={24}>
                      {danh_sach_nguyen_vong.length > 0 && <AntTable
                      columns={ds_xettuyen_columns}
                      rows={danh_sach_nguyen_vong.map((x, ind) => ({ ...x, stt: ind, key: ind }))}
                    // rowKey="stt"
                      />}</Col>

                  </Row></Spin>
                },
                {
                  label: `DANH SÁCH TRÚNG TUYỂN TUYỂN`,
                  key: '2',
                  children: <Spin spinning={loading_dsxt} > <Row>

                    {danh_sach_trung_tuyen?.length > 0 ? <Space style={{ padding: 5 }}>
                      <XacNhanNhapHoc maDotTuyenSinh={maDotTuyenSinh} lock={lock}/>
                      <Button style={{ textAlign: 'right' }} type='primary' icon={< DownloadOutlined />} onClick={() => onClickDownDSTT(ds_tt_columns, danh_sach_trung_tuyen, 'DSTrungTuyen')} >Tải về Danh Sách Túng tuyển</Button>
                    </Space> : <h3 style={{ color: 'red' }}>Chưa có danh sách trúng tuyển</h3>}

                    <AntTable
                      columns={ds_tt_columns}
                      rows={danh_sach_trung_tuyen}
                      rowKey="soBaoDanh"
                    />
                  </Row>
                  </Spin>
                }]} />
            </Row>
            <Divider />
          </Col>}
        </Row>

        {/* <Row style={{ overflowY: 'scroll', maxHeight: '70vh' }}>
          <Col span={12}>
            <Row><h4>DANH SÁCH XÉT TUYỂN</h4></Row>
          </Col>
          <Col span={12}>
          <Row><h4>DANH SÁCH TRÚNG TUYỂN TUYỂN</h4></Row>
          </Col>
        </Row> */}
        <Divider />
        {/* <Row style={{ textAlign: 'right', marginBottom: '10px' }}>
          <Button>Thêm Đợt Tuyển Sinh</Button>
        </Row> */}
        {/* <Row>
          <Col span={24}>
            <AntTable columns={dot_columns} rows={tuyenSinhState.list_dot_ts} loading={loading} />
          </Col>
        </Row> */}
        {modalResultControl.open && <ModalDSXT tenDotTuyenSinh={dataDotTuyenSinh.tenDotTuyenSinh}
          onSaveDSXT={onSaveDSXT} {...modalResultControl}
          onSaveTuyenThang={onSaveTuyenThang}
          onCancel={() => { setModalResultControl(prev => ({ ...prev, open: false })) }} />}
      </Spin>
    </div>
  );
}