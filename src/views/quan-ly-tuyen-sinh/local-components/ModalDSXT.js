import { Button, Modal, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DownloadOutlined, EyeOutlined, FilterOutlined, DeleteOutlined, SaveTwoTone } from '@ant-design/icons';
import AntTable from '../../../components/table/AntTable';

const ModalDSXT = ({ open, tenDotTuyenSinh,  title, loading, onCancel, data, onSaveDSXT, onSaveTuyenThang, ...props }) => {
  const columns = useSelector((state) => state.candidates).columns.map((c) => ({ ...c, width: 150 }));
  const [visible_tuyen_thang, setVisible_tuyen_thang] = useState(columns.find((c) => c.dataIndex == 'dieuKienKhac'));
  const rows = useSelector((state) => state.candidates).dataXetTuyen.valid;
  const invalidRows = useSelector((state) => state.candidates).dataXetTuyen.invalid;
  const [openMini, setOpenMini] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', subTitle: '' });
  const onClickSaveDSXT = () => {
    setConfirmDialog({
      open: true,
      title: 'Lưu danh sách xét tuyển',      
      tuyenThang: false,
      subTitle: `Hệ thống sẽ xoá toàn bộ danh sách cũ và thay vào danh sách xét tuyển này của đợt tuyển sinh ${tenDotTuyenSinh}. Bạn có chắc chắn muốn lưu danh sách xét tuyển?`,
    });

  }
  const onClickTuyenThang = () => {
    setConfirmDialog({
      open: true,
      title: 'Lưu danh sách xét tuyển',
      tuyenThang: true,
      subTitle: `Hệ thống sẽ xoá toàn bộ danh sách cũ nếu có, và lưu toàn bộ thí sinh này vào danh sách trúng tuyển ${tenDotTuyenSinh}. Bạn có chắc chắn muốn lưu?`,
    });

  }
  return (
    <>
      <Modal
        key="q"
        title={<><Space>{title}
          {/* <Button type='default' icon={< DownloadOutlined />}>Tải Về</Button> */}
          <Button type='primary' onClick={onClickSaveDSXT} icon={<SaveTwoTone />}>Lọc Trúng Tuyển File này</Button>
          {visible_tuyen_thang && <Button type='primary' style={{ background: "#614add", borderColor: "#05ff00" }} onClick={onClickTuyenThang} icon={<SaveTwoTone />}>Tuyển Thẳng danh sách thí sinh</Button>}
        </Space>
          <Row><h3 style={{ color: '#185adb', textDecoration: 'underline' }}>{`${rows.length} Hồ Sơ Hợp Lệ`}</h3></Row></>
        }
        centered
        open={open}
        footer={null}

        // onOk={() => setOpen(false)}
        onCancel={onCancel}
        width={1400}
        bodyStyle={{ height: 650 }}
      >
        <Row>
          {visible_tuyen_thang && (
            <h4 style={{ color: '#185adb' }}>
              <span style={{ color: 'red', textDecoration: 'underline' }}>Lưu ý: </span>
              Nếu xác nhận <span style={{ color: 'black', textDecoration: 'underline' }}> tuyển thẳng danh sách thí sinh </span>, hệ thống sẽ lưu toàn bộ thí sinh này là đã trúng tuyển.
              Nếu thí sinh xác nhận nhập học, thí sinh không được xem xét tuyển các nguyện vọng khác trong hồ sơ thi THPTQG sau này.
              Nếu thí sinh không xác nhận nhập học, thí sinh vẫn có thể xét tuyển các nguyện vọng khác sau này.
            </h4>
          )}
        </Row>
        {open && <AntTable loading={loading} columns={columns} rows={rows} />}

        <Modal
          key='e'
          centered
          title={confirmDialog.title}
          open={confirmDialog.open}
          width={400}
          bodyStyle={{ height: 250, color:'red', fontSize:'16px' }}
          onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
          onOk={() => { 
            if (confirmDialog.tuyenThang) {
              onSaveTuyenThang();
              return;
            }
            setConfirmDialog({ ...confirmDialog, open: false }); 
            onSaveDSXT() }}
        >
          {confirmDialog.subTitle}

        </Modal>
      </Modal>
      <Modal
        key='w'
        centered
        title={`${invalidRows.length} Hồ sơ Không Hợp Lệ vì Ngành Không Tuyển hoặc Mã Tổ Hợp Không xét`}
        open={open && openMini && invalidRows.length > 0}
        width={900}
        bodyStyle={{ height: 650 }}
        footer={null}
        onCancel={() => setOpenMini(false)}
      >
        {invalidRows.length > 0 && <AntTable loading={loading} columns={[
          { dataIndex: 'soBaoDanh', title: 'Số Báo Danh', key: 'soBaoDanh', width: 100 },
          { dataIndex: 'maNganh', title: 'Mã Ngành', key: 'maNganh', width: 100 },
          { dataIndex: 'maToHopXetTuyen', title: 'Mã Tổ Hợp Xét Tuyển', key: 'maToHopXetTuyen', width: 50 },
          { dataIndex: 'reason', title: 'Lý Do', key: 'reason', width: 150 },
        ]
        } rows={invalidRows} />}
      </Modal>

    </>
  );
};
export default ModalDSXT;