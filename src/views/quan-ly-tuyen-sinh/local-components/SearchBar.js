import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
import React from 'react';
const { Search } = Input;
export default function SearchBar({ onSearching }) {
  const onSearch = (value) => {
    console.log(value);
    // onSearching(value);
  }
  return (
    <Search style={{
      width: 400,
    }} placeholder="Tìm Kiếm Khoá Tuyển Sinh" onSearch={onSearch} enterButton />
  );
};