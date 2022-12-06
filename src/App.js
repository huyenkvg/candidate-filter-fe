import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import Home from './views/home/Home';
import './App.css';
import Login from './views/login/Login';
import AntTable from './components/table/AntTable';
import TuyenSinh from './views/tuyen-sinh/TuyenSinh';
import LoginForm from './views/login/LoginForm';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { logout, setUserLoginn } from './features/User/userSlice';
import KhoaTuyenSinh from './views/quan-ly-tuyen-sinh/khoa-tuyen-sinh/KhoaTuyenSinh';
import DotTuyenSinh from './views/quan-ly-tuyen-sinh/dot-tuyen-sinh/DotTuyenSinh';
import Nganh from './views/quan-ly-tuyen-sinh/nganh/Nganh';
import ToHopXetTuyen from './views/quan-ly-tuyen-sinh/to-hop/ToHopXetTuyen';
import NguoiDung from './views/users/NguoiDung';
import HoSoTuyenSinh from './views/quan-ly-tuyen-sinh/HoSoTuyenSinh';
import ThongKe from './views/thong-ke/ThongKe';

function App() {
  const user = useSelector(state => state.userSlice);
  const dispatch = useDispatch(); 

  const privateRoutes = [
        { path: '/', element:  <TuyenSinh /> },
        { path: '/thong-ke', element:  <ThongKe/> },
        { path: '/loc-trung-tuyen', element: <TuyenSinh /> },
        { path: '/khoa-tuyen-sinh', element: <KhoaTuyenSinh /> },
        { path: '/nguoi-dung', element: <NguoiDung /> },
        { path: '/nganh', element: <Nganh /> },
        { path: '/to-hop', element: <ToHopXetTuyen/> },
        { path: '/dot-tuyen-sinh/:maDotTuyenSinh', element: <DotTuyenSinh /> },
        { path: '/ho-so-tuyen-sinh', element: <HoSoTuyenSinh/> },
        { path: '/home', element: <Home /> },
  ]
  const publicRoutes = [
    { path: '/login', element: <LoginForm /> },
  ]

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      dispatch(setUserLoginn({ isLoggedIn: true }));
      // navigate('/tuyen-sinh');
    }
    else {
      dispatch(logout());
    }
  },[])

  return (
    <Router>
   
      <AppLayout>
        <Routes>
          {user.isLoggedIn ? 
            privateRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))
            :
            publicRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))
          }
        </Routes>

      </AppLayout>
    </Router> 

  );
}

export default App;

{/* <Route path="/" element={<TuyenSinh/>} />
<Route path="/loc-trung-tuyen" element={<TuyenSinh/>} />
<Route path="/khoa-tuyen-sinh" element={<KhoaTuyenSinh/>} />
<Route path="/home" element={<Home />} />
<Route path="/login" element={<LoginForm />} /> */}