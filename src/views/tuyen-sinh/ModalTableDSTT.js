import { Button, Modal, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DownloadOutlined, EyeOutlined, FilterOutlined, DeleteOutlined, SaveTwoTone  } from '@ant-design/icons';
import AntTable from '../../components/table/AntTable';
const ModalTableDSTT = ({ open, title, loading, onCancel, data, ...props }) => {
  console.log('props :>> ', props);
  // const  = props;
  // const [visible, setVisible] = useState(open);

  const [rows, setRows] = useState(Object.values(data).flat().map(x => ({ ...x, key: x.combinedKey })).sort((a, b) => a.maNganh - b.maNganh));
  console.log('rows :>> ', rows);
  const columns = useSelector((state) => state.candidates).columns.map((c) => ({ ...c, width: 200 }));
  useEffect(() => {
    setRows(Object.values(data).flat().map(x => ({ ...x, key: x.combinedKey })).sort((a, b) => a.maNganh - b.maNganh));
  }, [data]);
  return (
    <>
      <Modal
        title={<Space>{title}
          <Button type='default' icon={< DownloadOutlined />}>Tải Về</Button>
          <Button type='default' icon={<SaveTwoTone />}>Lưu Kết Quả</Button>
        </Space>}
        centered
        open={open}
        footer={null}

        // onOk={() => setOpen(false)}
        onCancel={onCancel}
        width={1400}
        bodyStyle={{ height: 650 }}
      >

      {open &&  <AntTable loading={loading} columns={columns} rows={rows} />}
      </Modal>
    </>
  );
};
export default ModalTableDSTT;