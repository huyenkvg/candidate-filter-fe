import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import Home from './views/home/Home';
import './App.css';
import Login from './views/login/Login';
import AntTable from './components/table/AntTable';
import TuyenSinh from './views/tuyen-sinh/TuyenSinh';
import KhoaTuyenSinh from './views/quan-ly-tuyen-sinh/KhoaTuyenSinh';
import LoginForm from './views/login/LoginForm';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { logout, setUserLoginn } from './features/User/userSlice';

function App() {
  const user = useSelector(state => state.userSlice);
  const dispatch = useDispatch(); 

  const privateRoutes = [
        { path: '/', element:  <TuyenSinh /> },
        { path: '/loc-trung-tuyen', element: <TuyenSinh /> },
        { path: '/khoa-tuyen-sinh', element: <KhoaTuyenSinh /> },
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