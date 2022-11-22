import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
import React from 'react';
const { Search } = Input;
export default function SearchBar({ onSearching, label }) {
  const onSearch = (e) => {
    console.log(e.target.value);
    onSearching(e.target.value);
  }
  return (
    <Search style={{
      width: 400,
    }} placeholder={label} onChange={onSearch} enterButton />
  );
};