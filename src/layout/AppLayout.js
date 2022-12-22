import {
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Card, Image, Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout, setUserLoginn } from '../features/User/userSlice';
import UserMenu from './local-components/UserMenu';
import img from '../assets/images/Logo_PTIT_University.png';

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
  // getItem('Người Dùng', 'nguoi-dung', <TeamOutlined />),
  getItem('Thống Kê', 'thong-ke', <TeamOutlined />),
  getItem('Tool Lọc', 'loc-trung-tuyen', <UserOutlined />),
  ,
  getItem('Tuyển Sinh', 'tuyen-sinh', <UserOutlined />, [
    getItem('Khoá Tuyển Sinh', 'khoa-tuyen-sinh', <UserOutlined />),
    getItem('Hồ Sơ Tuyển Sinh', 'ho-so-tuyen-sinh', <UserOutlined />),
    getItem('Ngành', 'nganh', <UserOutlined />),
    getItem('Tổ Hợp', 'to-hop', <UserOutlined />),
    // getItem('Khoá Tuyển Sinh', 'nganh', <UserOutlined />),
  ]),
];
const admin_items = [
  getItem('Người Dùng', 'nguoi-dung', <TeamOutlined />),
  getItem('Thống Kê', 'thong-ke', <TeamOutlined />),
  getItem('Tool Lọc', 'loc-trung-tuyen', <UserOutlined />),
  ,
  getItem('Tuyển Sinh', 'tuyen-sinh', <UserOutlined />, [
    getItem('Khoá Tuyển Sinh', 'khoa-tuyen-sinh', <UserOutlined />),
    getItem('Hồ Sơ Tuyển Sinh', 'ho-so-tuyen-sinh', <UserOutlined />),
    getItem('Ngành', 'nganh', <UserOutlined />),
    getItem('Tổ Hợp', 'to-hop', <UserOutlined />),
    // getItem('Khoá Tuyển Sinh', 'nganh', <UserOutlined />),
  ]),
];
const hide_path = [
 {str: 'dot-tuyen-sinh', title: 'Khoá Tuyển sinh', child: ' Đợt Tuyển sinh'},
]

const AppLayout = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector(state => state.userSlice);
  const role = JSON.parse(localStorage.getItem('userInfo'))?.role;
  const navigate = useNavigate()
  const location = useLocation();
  const dispatch = useDispatch();

  const handleClick = (e, type) => {
    console.log('click', e);
    if (type === 'CLICK-MENU') {
      // props.history.push(`/${e.key}`);
      navigate(`/${e.key}`);
    }
  }
  useEffect(() => {
    if(location.pathname === '/login') {
      navigate('/khoa-tuyen-sinh');
    }
  }, [user.isLoggedIn])
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      dispatch(setUserLoginn({ isLoggedIn: true }));
      // navigate('/tuyen-sinh');
    }
    else {
      console.log('cvbnm :>> ');
      dispatch(logout());
      navigate('/login');      
    }
  },[location.pathname])

  return (

    user.isLoggedIn ?
      <Layout style={{ minHeight: '100vh' }} >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div style={{textAlign:'center', marginTop: 20, }}>
            <h2  style={{color:'#fff'}}>PTIT HCM</h2>
            <Image
              width={90}
              src={require("../assets/images/Logo_PTIT_University.png")}
            />

          </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={role?.name == "ADMIN" ? admin_items :items} onClick={e => handleClick(e, 'CLICK-MENU')} />
      </Sider>
      <Layout className="site-layout">
        <Header

          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >
            <UserMenu />
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
                textDecoration: 'underline',
                textTransform: 'uppercase'
            }}
          >
            {
              items.map((item) => {
                return item.children ? item.children.map((child) => {
                  if (location.pathname.includes(child.key) ) {
                    return (
                      <>
                        <Breadcrumb.Item key={item.key}>{item.label}</Breadcrumb.Item>
                        <Breadcrumb.Item onClick={e => handleClick({ key: child.key }, 'CLICK-MENU')} key={child.key}>{child.label}</Breadcrumb.Item>
                      </>
                    )
                  }
                }) :
                  location.pathname.includes(item.key) && <Breadcrumb.Item key={item.key}>{item.label}</Breadcrumb.Item>
              })
            }
            {
              hide_path.map((path) => {
                if (location.pathname.includes(path.str)) {
                  return <>
                  <Breadcrumb.Item key={path.str}>{path.title}</Breadcrumb.Item>
                  <Breadcrumb.Item key={path.child}>{path.child}</Breadcrumb.Item>
                </>
                }
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
      :
      <>
        {props.children }</>

  );
};
export default AppLayout;