import { Alert, Button, Col, Divider, Form, Input, List, message, Modal, Row, Select, Space, Spin, Tree } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CandidateAPI from "../../apis/CandidateAPI";
import UploadButton from "../../components/input/UpLoadButton";
import AntTable from "../../components/table/AntTable";
import { reset, setChiTieuNganh, setDanhSachCandidate, setDataXetTuyen } from "../../features/ThiSinh/candidateSlice";
import { DownloadOutlined, EyeOutlined, FilterOutlined, DeleteOutlined } from '@ant-design/icons';
import { Option } from "antd/lib/mentions";
import { setDanhSachTrungTuyen } from "../../features/DSST/dsttSlice";
import ModalTableDSTT from "./ModalTableDSTT";

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
// ĐIỀU KIỆN ƯU TIÊN
function CayDieuKienUuTien(props) {
  const { data, onCayDieuKienChange } = props;
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [motaDieuKien, setMotaDieuKien] = useState({});
  const [yourQuery, setYourQuery] = useState("");
  const onCheck = (checkedKeys, info) => {
    // console.log('onCheck', info);
    setCheckedList(checkedKeys.map(selected => {
      return treeData.find(item => item.key === selected);
    }));
    setMotaDieuKien(prev => {
      return info.checkedNodes.reduce((obj, node) => {
        obj[node.dataKey] = prev[node.dataKey] || "DESC";
        return obj;
      }, {})
    });
    // console.log('chẹkedList :>> ', checkedList);
    // console.log('motaDieuKien :>  > ', motaDieuKien);
    // console.log('data :>> ', data);
  };
  const onCancelSelect = (item) => {
    // console.log('cancel item :>> ', item);
    // console.log('checkedList :>> ', checkedList);
    setCheckedList(checkedList.filter(selected => selected.key !== item.key));
    setMotaDieuKien(prev => {
      let obj = {};
      for (const key in prev) {
        if (key !== item.dataKey) {
          obj[key] = prev[key];
        }
      }
      return obj;
    });

  }
  const handleDropdownChange = (e, item) => {
    setMotaDieuKien({ ...motaDieuKien, [item.dataKey]: e });
  }

  useEffect(() => {
    // console.log('checkedList.map(x=> x.dataKey) :>> ', checkedList.map(x => x.dataKey));
    onCayDieuKienChange(checkedList.map(x => x.dataKey), motaDieuKien);
    if (checkedList.length > 0) {
      let query = "Hệ thống sẽ ưu tiên chọn Hồ Sơ có ";
      checkedList.forEach((item, index) => {
        query += `${item.title} ${motaDieuKien[item.dataKey] === 'ASC' ? 'nhỏ hơn' : 'lớn hơn'}`
        if (index < checkedList.length - 1) {
          if (index + 1 === checkedList.length - 1) {
            query += `, nếu thí sinh có ${item.title} bằng nhau, thì sẽ ưu tiên chọn hồ sơ có `;
          }
          else query += ', ';
        }
      })

      setYourQuery(query);
    }
    else
      setYourQuery('');
  }, [checkedList, motaDieuKien]);
  useEffect(() => {
    if (data) {
      let arr = Object.keys(data).map((key, index) => {
        return {
          dataKey: key,
          title: data[key],
          key: `0-${index}`,
        }
      })
      setTreeData(arr);
    }
  }, [data]);
  return (
    <Col span={24} style={{}}>
      <h3>Chọn điều kiện xét tuyển ưu tiên <span style={{ color: 'red' }}> - Mức độ ưu tiên từ trên xuống</span></h3>
      <Row>
        <h4 style={{ fontSize: '16px', color: '#185adb' }}>
          {yourQuery}
        </h4>
      </Row>
      <Row>
        <Col span={12} style={{ overflowY: 'auto', maxHeight: '70vh' }}>
          <Tree
            checkable
            checkedKeys={checkedList.map(item => item.key)}
            onCheck={onCheck}
            treeData={treeData}
          />
        </Col>
        <Col span={12} style={{ paddingLeft: '10px' }}>
          <Form layout={{
            labelCol: {
              span: 3,
            },
            wrapperCol: {
              span: 20,
            },
          }}>
            {checkedList.map((item, index) => {
              return <Form.Item key={item.key} name={item.title} label={<>{`điều kiện ${index + 1} )  `}<span style={{ fontWeight: '600' }}>{item.title}</span></>} >
                <Space > <Select
                  size="small"
                  onChange={(e) => handleDropdownChange(e, item)}
                  defaultValue="DESC"
                  style={{
                    width: 120,
                  }}
                >
                  <Option value="ASC">(ASC) TĂNG</Option>
                  <Option value="DESC">(DESC) GIẢM</Option>
                </Select>
                  <Button type='default' shape="circle" size="small" onClick={(e) => { onCancelSelect(item) }} icon={<DeleteOutlined />} />
                </Space>
              </Form.Item>

            })}</Form>

        </Col>
      </Row>
    </Col>
  );
};

function ListChiTieuCacNganh(props) {
  const { data, chiTieuNganh, onChiTieuChange } = props;
  const [keys, setKeys] = useState([]);
  const [values, setValues] = useState([]);
  const onInputChange = (e, key) => {
    onChiTieuChange(key, e.target.value);
  }
  useEffect(() => {
    if (data) {
      setKeys(Object.keys(data));
      setValues(Object.values(data));
    }
  }, [data]);
  return (
    <div>
      <h3>Nhập Chỉ Tiêu Tuyển Sinh</h3>
      <p>Tổng cộng {keys.length} ngành và {values.flat().length} thí sinh</p>
      <List
        style={{ paddingRight: '20px' }}
        itemLayout="horizontal"
        dataSource={keys}
        renderItem={(key) => (
          <List.Item style={{ position: 'relative', paddingRight: '10px', margin: '2px' }}>
            {/* <Divider /> */}
            <Row >
              <Col span={14} style={{}}>
                <span style={{ fontWeight: '500', color: '#185adb' }}>{key} - {data[key][0].tenNganh}:</span> <span>{data[key] ? data[key].length : 0} Thí Sinh</span>
              </Col>
              <Col span={10} style={{ position: 'absolute', right: 0, top: 15 }}>
                {
                  chiTieuNganh ?
                    <h4>Chỉ tiêu tuyển: {chiTieuNganh[key]}</h4>
                    :
                    <Input onChange={e => onInputChange(e, key)} placeholder={`Nhập chỉ tiêu (<=${data[key].length})`} />
                }
              </Col>
            </Row>

          </List.Item>
        )}
      />
    </div>
  )


}

function PriorityConditions(props) {
  const { data } = props;
  const [keys, setKeys] = useState([]);
  const [values, setValues] = useState([]);
  useEffect(() => {
    setKeys(Object.keys(data));
    setValues(Object.values(data));
  }, [data]);
  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={keys}
        renderItem={(key) => (
          <List.Item>
            <List.Item.Meta
            />
            <span style={{ fontWeight: '500' }}>{key}:</span> <span>{data[key]}</span>

          </List.Item>
        )}
      />
    </div>
  )

}
export default function TuyenSinh() {
  // Khai báo
  const [loading, setLoading] = useState(false);
  const [fileInput, setFileInput] = useState(null);
  const [modalResultControl, setModalResultControl] = useState({open: false, title: "KẾT QUẢ LỌC" ,loading: false, data: null});
  const [groupCandidates, setGroupCandidates] = useState(null);
  const [dataSubmit, setDataSubmit] = useState({});
  const dispatch = useDispatch();
  const candidates = useSelector((state) => state.candidates);
  const danhSachTrungTuyen = useSelector((state) => state.dsttSlice);
  const { groupByMaNganh, groupBySoBaoDanh } = candidates;


  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleDieuKienChange = (ds_dieukien, mota_dieukien) => {
    if (ds_dieukien.length > 0 && groupByMaNganh && groupBySoBaoDanh) {
      setDataSubmit({ ...dataSubmit, ds_dieukien, mota_dieukien });
    }
    else {
      setDataSubmit(null);
    }
  }
  const handleChiTieuChange = (key, newValue) => {
    let chiTieuNganh = dataSubmit ? { ...dataSubmit.chiTieuNganh, [key]: newValue } : { [key]: newValue };
    if (newValue && groupByMaNganh && groupBySoBaoDanh) {
      setDataSubmit({ ...dataSubmit, chiTieuNganh });
    // dispatch(setChiTieuNganh(chiTieuNganh));
    // console.log('on chi tieu nagnh change input :>> ', dataSubmit);
    }
    else {
      setDataSubmit(null);
    }
  }

  // Sự kiện
  const onSubmitFilter = () => {
    console.log('fileInput :>> ', fileInput);
    if (dataSubmit.ds_dieukien && dataSubmit.ds_dieukien.length>0 && dataSubmit.chiTieuNganh && dataSubmit.mota_dieukien && fileInput.get('file')) {
      let formData = new FormData();
      formData.append('file', fileInput.get('file'));
      formData.append('data', JSON.stringify(dataSubmit));
      setLoading(true);
      CandidateAPI.filterCandidates(formData).then(res => {
        const { data } = res;
        if (data.dstt) {
          dispatch(setDanhSachTrungTuyen(data.dstt));
          console.log('danhSachTrungTuyen.dstt :>> ', danhSachTrungTuyen.data);
          setModalResultControl({open: true, title: "KẾT QUẢ LỌC", loading: false, data: res.data.dstt});
          showMessage('success', 'Lọc Danh Sách Trúng Tuyển thành công');

        }
      }).catch(
        err => {
          showMessage('error', 'Lọc Danh Sách Trúng Tuyển thất bại');
        }

      ).finally(() => {

        setLoading(false);
      })
    }
  }



  const upFileHandler = (data) => {
    setLoading(true);
    dispatch(setDataXetTuyen([]))
    CandidateAPI.getCandidatesFromXls(data).then((res) => {
      if (res.data.error) {
        showMessage('error', res.data.error);
        setLoading(false);
        return;
      }
      const { headerObject, wishList, groupByMaNganh, groupBySoBaoDanh, chiTieuNganh, } = res.data;

      // setGroupNganh(groupByMaNganh);
      // setGroupCandidates(groupBySoBaoDanh);

      let rows = wishList.map((x, index) => ({ ...x, key: index }));
      let columns = Object.keys(headerObject).map((item) => ({
        title: headerObject[item],
        dataIndex: item,
        key: item,
      }))

      dispatch(setDanhSachCandidate({ rows, columns, headerObject, chiTieuNganh, groupByMaNganh, groupBySoBaoDanh }));
      setLoading(false);
      setFileInput(data);
      // console.log('hihihi data :>> ', data);
      showMessage('success', 'Đã tải danh sách hồ sơ xét tuyển thành công');
    }).catch((err) => {
      showMessage('error', `Có lỗi xảy ra, ${err.message}`);
      setLoading(false);
    })
  }
  useEffect(() => {
    dispatch(reset())
  },[])

  return (
    <div style={{ overflowX: 'scroll' }}>
      <h4>Tải Lên File XLS có Danh Sách Các thí Sinh, Lưu ý file cần phải thoã các <Button type='text' onClick={showModal} style={{ color: 'red' }}> yêu cầu </Button> </h4>
      <Modal title="Yêu cầu file xls" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>File Excel cần có Sheet tên "Mini" chứa dữ liệu cần trích xuất.</p>
        <p>Các Header của cột phải nằm ở hàng trên cùng.</p>
        <p>Các cột <span style={{ color: 'orange' }}>Số Báo Danh, Mã Ngành, Tổng Điểm, Nguyện Vọng</span> là bắt buộc</p>
        <p>Có Thể <Button type='link' icon={< DownloadOutlined />}>Tải Template</Button> để điền thông tin sau đó nộp</p>
      </Modal>
      <Spin spinning={loading} >
        <Space><Button icon={< DownloadOutlined />}>Tải Template</Button>
        <UploadButton onUpload={upFileHandler} />
        </Space>

        <Divider />
         <div style={{ display: (fileInput ? "block" : "none")}}>
        <Row >
          <Col span={8}>
            {candidates.groupByMaNganh && <ListChiTieuCacNganh onChiTieuChange={handleChiTieuChange} data={candidates.groupByMaNganh} chiTieuNganh={candidates.chiTieuNganh} />}
            {/* hihihihihhi */}
          </Col>
          <Col span={16} style={{ textAlign: 'center', }}>

            {/* <Divider /> */}
            {/* <Col span={8} style={{ overflowY: 'scroll', maxHeight: '60vh' }}> */}
            {candidates.headerObject && <CayDieuKienUuTien data={candidates.headerObject} onCayDieuKienChange={handleDieuKienChange} />}
            {/* </Col> */}
            {/* <Col span={8}>
          </Col> */}
          </Col>
        </Row>
        <Divider />
        <Row style={{ justifyContent: 'right', marginBottom: '10px', }}>
          <Button disabled={(!dataSubmit || !dataSubmit.ds_dieukien || !dataSubmit.chiTieuNganh )} style={{ color: 'green', borderColor: 'green', backgroundColor: '#bbffbb33' }} onClick={onSubmitFilter} icon={<FilterOutlined />}>LỌC DANH SÁCH TRÚNG TUYỂN</Button >
        </Row>
        <Row>
          <Col span={24}>
            {!loading && <AntTable columns={candidates.columns.map((item) => ({...item, width: 'auto'}))} rows={candidates.rows} loading={loading} />}
             
          </Col>
          </Row>
        </div>
      </Spin>
      {modalResultControl.data && <ModalTableDSTT {...modalResultControl} onCancel={()=>{setModalResultControl(prev=>({...prev, open:false}))}}/>}
    </div>
  );
}