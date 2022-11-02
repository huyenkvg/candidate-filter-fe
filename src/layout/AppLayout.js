import {
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserMenu from './local-components/UserMenu';
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('Người Dùng', 'nguoi-dung', <TeamOutlined />),
  getItem('Lọc Trúng Tuyển', 'loc-trung-tuyen', <UserOutlined />),
  ,
  getItem('Tuyển Sinh', 'tuyen-sinh', <UserOutlined />, [
    getItem('Khoá Tuyển Sinh', 'khoa-tuyen-sinh', <UserOutlined />),
    // getItem('Khoá Tuyển Sinh', 'nganh', <UserOutlined />),
  ]),
];

const AppLayout = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate()
  const location = useLocation();

  const handleClick = (e, type) => {
    console.log('click', e);
    if (type === 'CLICK-MENU') {
      // props.history.push(`/${e.key}`);
      navigate(`/${e.key}`);
    }
  }
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={e => handleClick(e, 'CLICK-MENU')} />
      </Sider>
      <Layout className="site-layout">
        <Header
          
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >
          <UserMenu/>
        </Header>
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
              fontSize: '16px',
              textDecoration:'underline',
              textTransform:'uppercase'
            }}
          >
            {
              items.map((item) => {
                return item.children ? item.children.map((child) => {
                  if (location.pathname.includes(child.key)) {
                    return (
                      <>
                        <Breadcrumb.Item key={item.key}>{item.label}</Breadcrumb.Item>
                        <Breadcrumb.Item onClick={e => handleClick({key: child.key}, 'CLICK-MENU')} key={child.key}>{child.label}</Breadcrumb.Item>
                      </>
                    )
                  }
                }) : 
                location.pathname.includes(item.key) && <Breadcrumb.Item key={item.key}>{item.label}</Breadcrumb.Item>
              })



            }
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{
              padding: 0,
              minHeight: 360,
            }}
          >
            {props.children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          HuyenKute - Hehehe
        </Footer>
      </Layout>
    </Layout>
  );
};
export default AppLayout;