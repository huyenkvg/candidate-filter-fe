import { DownOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Menu, Space, Table } from 'antd';
import React from 'react';
import './Table.css'
const menu = (
  <Menu
    items={[
      {
        key: '1',
        label: 'Action 1',
      },
      {
        key: '2',
        label: 'Action 2',
      },
    ]}
  />
);

export default function Complextable(props) {
  const columns = props.columns;
  const child_columns =  props.child_columns;
  const data = props.data;
  const expandedRowRender = (props) => {
    const parent = props.maKhoa;

    const child_rows = data.find((item) => item.maKhoa === parent).danh_sach_dot_tuyen.map((x, index) => ({...x, index: index+1,}));

    return <Table  showHeader={false} columns={child_columns} dataSource={child_rows} pagination={false} />;
  };
  return (
    <>
      <Table 
        columns={columns}
        expandable={{
          expandedRowRender,
          // defaultExpandedRowKeys: ['0'],
        }}
        dataSource={data}
      />
    </>
  );
};