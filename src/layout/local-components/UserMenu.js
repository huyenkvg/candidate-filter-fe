import { Dropdown, Menu } from "antd";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom"; import {
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

export default function UserMenu() {
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState({username: 'huyennguyen@ptithcm.com.vn'});
  const navigate = useNavigate();
  // const history = unstable_HistoryRouter();
  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem('user'));
    // setUser(user);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <>Thông tin cá nhân</>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  return (
    <div style={{display:'flex', textAlign:'right', justifyContent:'end', paddingRight:'20px'}}>
      <Dropdown overlay={menu} trigger={['click']}>
        <a
          className="ant-dropdown-link"
          onClick={(e) => e.preventDefault()}
          style={{ color: 'white' }}
        >
          {user.username} <UserOutlined  style={{fontSize:'22px',}}/>
        </a>
      </Dropdown>
    </div>
  );
}